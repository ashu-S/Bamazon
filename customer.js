var mysql = require ("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');

var uid;
var password;
var availableStock;
var totalAmount;
var chosenItem;

// Establish a conection with mysql bamazon database
var connection = mysql.createConnection({
	host: "localhost",
	port:3306,

	user: 'root',
	password: 'sqldev11',
	database: 'bamazon'
});

connection.connect(function(err){
	if(err)
	{
		throw err;
	}
	
	customerView();
			
}); // Close connect

function customerView()
{
	var query = connection.query("select * from products",
		function(err,res)
		{
			if(res.length != 0)
			{
				var table = new Table({head:["------------------------------ Welcome to Bamazon ------------------------------------------"]});
				table.push(["--------------------------- Your very own online bazaar ------------------------------------"]);
				table.push(['-----------------------Select from the below available products------------------------------']);
				  console.log("  ");
				  console.log("  ");
				  console.log(table.toString());
				  console.log("  ");
				  console.log("  ");

				table = new Table({head:['Item_id','Product_name','Department_name','Price','Stock_quantity','Product_sales']});

		        //loops through each item in the mysql database and pushes into as new record in the table
			    for(var i = 0; i < res.length; i++)
			    {
				    table.push([res[i].item_id, res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity, res[i].product_sales]);
			    }
		  		console.log(table.toString());
		  		//get input from user
		  		getProductInput(res);
			} 
			
		});
	
}


function getProductInput(res)
{
	console.log("Please enter the details for the products you want to buy:");
	inquirer.prompt(
	 [{
	  	type: "input",
	  	message: "Enter the product Id: ",
	  	name: "prodId"
	  },
	  { 
	  	type: "input",
	  	message: "Enter the quantity: ",
	  	name: "prodQty"
	  }]).then(function (answers) {
		    checkAvailability(answers,res);
		}); //End function(answers)
} //End getProductInput()


function checkAvailability(answers,res)
{
	console.log("res" + res.length);
	
       for (var i = 0; i < res.length; i++) {
          if (res[i].item_id === parseInt(answers.prodId)) {
            chosenItem = res[i];
            }
        }
        // To determine if the product is availaible in inventory or not
       
       var table = new Table({head:['Item', 'Availaible stock','Ordered Quantity']});
       	   table.push([chosenItem.product_name,chosenItem.stock_quantity, answers.prodQty]);

				  console.log("  ");
				  console.log(table.toString());
				  console.log("  ");

        if (parseInt(chosenItem.stock_quantity) < parseInt(answers.prodQty))
        {
          table = new Table({head:["Insufficient quantity!"]});	
          console.log("  ");
		  console.log(table.toString());
		  console.log("  ");
		  
        }
        else
        { 
          // Place order and calculate the available new stock.
          
          table = new Table({head:["sucessfully placed your order!"]});

          totalAmount = chosenItem.price * answers.prodQty;
		  table.push(["Total Amount", totalAmount]);
		  console.log(table.toString());
		  console.log("  ");

           availableStock = chosenItem.stock_quantity - parseInt(answers.prodQty);
           

           table = new Table({head:['Availaible Stock', availableStock]});
       	   console.log(table.toString());
		   console.log("  ");
		  //Call a function to update stocks
          updateStocks(availableStock,totalAmount,chosenItem);
        }  
}

function updateStocks(availableStock,totalAmount,chosenItem)
{
	totalAmount = totalAmount + chosenItem.product_sales;
	var query = 'UPDATE products SET stock_quantity = '+ availableStock +', product_sales = '+ totalAmount +' WHERE item_id='+ chosenItem.item_id;
	connection.query(query,function(err,res) {
    if (err) throw err;
        var table = new Table({head:["Stock updated sucessfully!"]});
        console.log(table.toString());
		console.log("  ");
		getUserInput();
    });
 
}

function getUserInput()
{
	inquirer.prompt(
	 [{
	  	type: "list",
	  	message: "Enter your choice: ",
	  	choices: ["Continue Shopping","Quit"],
	  	name: "action"
	  }]).then(function (answers) {
		switch (answers.action)
	  	{
	        case "Continue Shopping":
	          customerView();
	          break;

	        case "Quit":
	          var table = new Table({head:['Thank you for shopping with us!']});
			  console.log("  ");
			  console.log(table.toString());
			  console.log("  ");
			  console.log("  ");
	          break;
	    }
    });//End function(answers)
}
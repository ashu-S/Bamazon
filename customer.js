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
	console.log("successfully connected as ID : " + connection.threadId);
	console.log("------------------ Welcome to Bamazon ---------------");
	console.log("-------------- Your very own online bazaar ---------------")
	
	customerView();
			
}); // Close connect

function customerView()
{
	var query = connection.query("select * from products",
		function(err,res)
		{
			if(res.length != 0)
			{
				console.log("---------------------Select from the below available products----------------------------");
				
				var table = new Table({head:['Item_id','Product_name','Department_name','Price','Stock_quantity','Product_sales']});

		        //loops through each item in the mysql database and pushes into as new record in the table
			    for(var i = 0; i < res.length; i++)
			    {
				    table.push([res[i].item_id, res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity, res[i].product_sales]);
			    }
		  		console.log(table.toString());
		  		//get input from user
		  		console.log("res" + res.length);
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
		    console.log("res" + res.length);
		  	checkAvailability(answers,res);
		}); //End function(answers)
} //End getProductInput()

function checkAvailability(answers,res)
{
	console.log("res" + res.length);
	
       for (var i = 0; i < res.length; i++) {
          if (res[i].item_id === parseInt(answers.prodId)) {
            chosenItem = res[i];
            console.log("chosen item" + chosenItem);
          }
        }
        // To determine if the product is availaible in inventory or not
        console.log("chosenItem.stock_quantity" + chosenItem.stock_quantity);
        console.log("answers.prodQty" + answers.prodQty);
        if (parseInt(chosenItem.stock_quantity) < parseInt(answers.prodQty))
        {
          console.log("Insufficient quantity!");	
        }
        else
        { 
          // Place order and calculate the available new stock.
          console.log("sucessfully placed your order!");

          availableStock = chosenItem.stock_quantity - parseInt(answers.prodQty);
          totalAmount = chosenItem.price * answers.prodQty;
          console.log("total Amount: " + totalAmount);
          console.log("availaible stock :" + availableStock);

          //Call a function to update stocks
          updateStocks(availableStock,totalAmount,chosenItem);
        }  
}

function updateStocks(availableStock,totalAmount,chosenItem)
{
	var query = 'UPDATE products SET stock_quantity = '+ availableStock +', product_sales = '+ totalAmount +' WHERE item_id='+ chosenItem.item_id;
	console.log(query);
    connection.query(query,function(err,res) {
    if (err) throw err;
        console.log("Stock updated sucessfully!");
    });
}
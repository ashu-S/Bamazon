var mysql = require ("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');

var uid;
var password;
var availableStock;
var totalAmount;

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
	var table = new Table({head:["---------------------- Welcome to Bamazon ---------------------------"]});
	table.push(["------------------ Your very own online bazaar -------------------------"]);
	console.log("  ");
	console.log(table.toString());
	console.log("  ");
	
	managerView();
			
}); // Close connect


//get input from user
function managerView()
{
	console.log("Please enter your choice:");
	inquirer.prompt(
	 [{
	  	type: "list",
	  	message: "Enter your choice: ",
	  	choices: ["View Products for Sale","View Low Inventory","Add to Inventory",
        "Add New Product","Quit"],
	  	name: "action"
	  }]).then(function (answers) {
		switch (answers.action)
	  	{
	        case "View Products for Sale":
	          productSale();
	          break;

	        case "View Low Inventory":
	          lowInventory();
	          break;

	        case "Add to Inventory":
	          addInventory();
	          break;

	        case "Add New Product":
	          addProduct();
	          break;
	        case "Quit":
	          var table = new Table({head:['Exiting Manager View. Thank you!']});
			  console.log("  ");
			  console.log("  ");
			  console.log(table.toString());
			  console.log("  ");
			  console.log("  ");
	          break;
	    }
    });//End function(answers)
} //End getProductInput()

function productSale()
{
	var query= "SELECT item_id,product_name,price,stock_quantity,product_sales FROM products";
	connection.query(query,function(err, res) {
        if (err) throw err;

        var table = new Table({head:['Item_id','Product_name','Department_name','Price','Stock_quantity','Product_sales']});

		        //loops through each item in the mysql database and pushes into as new record in the table
			    for(var i = 0; i < res.length; i++)
			    {
				    table.push([res[i].item_id, res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity, res[i].product_sales]);
			    }
		  		console.log(table.toString());
		  		managerView(); //restart with getting user input
		});
	
}

function lowInventory()
{
	var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
	connection.query(query, function(err, res) {
                    if (err) throw err;
                    if (res.length > 0)
                    {
	                    var table = new Table({head:['Item_id','Product_name','Department_name','Price','Stock_quantity','Product_sales']});

					    //loops through each item in the mysql database and pushes into as new record in the table
						for(var i = 0; i < res.length; i++)
						{
							table.push([res[i].item_id, res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity, res[i].product_sales]);
						}
					    console.log(table.toString());
					}
					else
					{
						
						var table = new Table({head:['None of the products have low inventry.']});
						console.log("  ");
						console.log("  ");
						console.log(table.toString());
						console.log("  ");
						console.log("  ");
					}
					managerView(); //restart with getting user input
            });  
         
}


function addInventory()
{
	inquirer.prompt([{
                        type: "input",
                        message: "Enter the id of the item you would like to add the stock of:",
                        name: "idSelected"
                    },
                    {
                        type: "input",
                        message: "Enter the quantity to be added:",
                        name: "quantity_Selected"
                    },
                ]).then(function(answers) {
                	var answers_qty = parseInt(answers.quantity_Selected);
                	var answers_id = parseInt(answers.idSelected);
                //Select query to get the available stock to add the new stock qty to it.
                connection.query('SELECT * from products where item_id= ?', [answers_id] ,function (error, res) {
				      if (error) throw error;
				      var availableStock = parseInt(res[0].stock_quantity);
				      var newStock = availableStock + answers_qty;
				      
				          //UPDATE Query to update the new stock qty.
				        connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ? ',[newStock, answers_id], function (errors, result) {
				            if (errors) throw errors;
				            var table = new Table({head:['Inventory added successfully!']});
							console.log("  ");
							console.log("  ");
							console.log(table.toString());
							console.log("  ");
							console.log("  ");
                        	 managerView(); //restart with getting user input
				        }); // query update function
				    });//query select function
			});//then function
}

function addProduct()
{
	inquirer.prompt(
		[{
            type:"input",
            message: "What product would you like to add to bamazon?",
            name:"newProduct"
         },
         {
            type: "input",
            message: "What department does this product belong in?",
            name:"newProductDepartment"
        },
        {
            type:"input",
            message: "How much does this product cost?",
            name:"newProductPrice"
        },
        {
            type:"input",
            message: "How many of this item are in inventory?",
            name:"newProductQuantity"
        }]).then(function(answer){
                    			var values = {
                    				product_name:answer.newProduct,
                    				department_name:answer.newProductDepartment,
                    				price:answer.newProductPrice,
                    				stock_quantity: answer.newProductQuantity
                    			};
                   
                    			connection.query("INSERT INTO products SET ?", values, function(err){
                    				if (err) throw err;
                    				var table = new Table({head:['New item added successfully!']});
									console.log("  ");
									console.log("  ");
									console.log(table.toString());
									console.log("  ");
									console.log("  ");
                    				managerView(); //restart with getting user input
                    			});
                    		});

}


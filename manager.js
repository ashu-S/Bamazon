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
	console.log("------------------ Welcome to Bamazon ---------------");
	console.log("-------------- Your very own online bazaar ---------------")
	
	managerView();
			
}); // Close connect


//get input from user
function managerView()
{
	console.log("Please enter the details for the products you want to buy:");
	inquirer.prompt(
	 [{
	  	type: "list",
	  	message: "Enter your choice: ",
	  	choices: ["View Products for Sale","View Low Inventory","Add to Inventory",
        "Add New Product"],
	  	name: "action"
	  }]).then(function (answers) {
		console.log(answers);
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
	    }
    });//End function(answers)
} //End getProductInput()

function productSale()
{
	var query= "SELECT item_id,product_name,price,stock_quantity FROM products";
	connection.query(query,function(err, res) {
        if (err) throw err;

        var table = new Table({head:['Item_id','Product_name','Department_name','Price','Stock_quantity','Product_sales']});

		        //loops through each item in the mysql database and pushes into as new record in the table
			    for(var i = 0; i < res.length; i++)
			    {
				    table.push([res[i].item_id, res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity, res[i].product_sales]);
			    }
		  		console.log(table.toString());
		});
}

function lowInventory()
{
	var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
	connection.query(query, function(err, res) {
                    if (err) throw err;
                    var table = new Table({head:['Item_id','Product_name','Department_name','Price','Stock_quantity','Product_sales']});

		        //loops through each item in the mysql database and pushes into as new record in the table
			    for(var i = 0; i < res.length; i++)
			    {
				    table.push([res[i].item_id, res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity, res[i].product_sales]);
			    }
		  		console.log(table.toString());
			});
}

function addInventory()
{
	inquirer.prompt([{
                        type: "input",
                        message: "Enter the id of the item you would like to add.",
                        name: "idSelected"
                    },
                    {
                        type: "input",
                        message: "Enter updated quantity.",
                        name: "quantity_Selected"
                    },
                ]).then(function(answers) {
                        connection.query("UPDATE products SET ? WHERE ?",[
                        	{
                        		stock_quantity:answers.quantity_Selected
                        	},
                        	{
                        		item_id:answers.idSelected
                        	}
                        	], function(err){
                        	if (err) throw err;
                        	console.log("Items added successfully");	
                        });
	});
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
                    				console.log("Item Added!");
                    			})
                    		});

}
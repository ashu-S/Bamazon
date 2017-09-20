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
	
	supervisorView();
			
}); // Close connect

function supervisorView()
{

  inquirer.prompt(
  	[{
      name: "action",
      type: "list",
      message: "Enter your choice: ",
      choices: ["View Products Sales by Department","Create New Department"]
    }]).then(function(answers){
	      switch (answers.action) {
		        case "View Products Sales by Department":
		          productByDepartment();
		          break;
		        case "Create New Department":
		          createDepartment();
		          break;
	        }
    	});
}
function productByDepartment(){
	var query =  "select department_id,departments.department_name,over_head_costs,products.product_sales,(products.product_sales-departments.over_head_costs) as profit from products right join departments on products.department_name = departments.department_name";

	connection.query(query, function(err, res) {
	        var table = new Table({
	           head:['department_id','department_name','over_head_costs','productsale','Profit']
	        });

	        // loops through each item in the mysql database and pushes that information into a new row in the table
	       for(var i = 0; i < res.length; i++){
	         table.push(
	         [res[i].department_id, res[i].department_name, res[i].over_head_costs,res[i].product_sales,res[i].profit]
	         );
	       }
	  console.log(table.toString());
	});
}

function createDepartment()
{
  inquirer.prompt([
    { 
      type: "input",
      message: "Enter name of Department:",
      name: "deptName"
    },
    { 
      type: "input",
      message: "what is the overhead cost of the department?",
      name: "overheadCost"
    }
     
    ])
    .then(function(answers) {
         connection.query("INSERT INTO departments SET ?",
        {
          department_name : answers.deptName,
          over_head_costs:answers.overheadCost

        },
        function(err) {
          if (err) throw err;
          console.log("Department added successfully!");
          productByDepartment();
          supervisorView();
        }
      );
    });
}
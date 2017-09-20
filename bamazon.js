var mysql = require ("mysql");
var inquirer = require("inquirer");
const customer = require('./customer.js');
const manager = require('./manager.js');
const supervisor = require('./supervisor.js');

var uid;
var password;

function getUserInput()
{

	inquirer.prompt(
	 [{
	  	type: "rawlist",
	  	message: "Logging in as a?",
	  	choices: ["Customer", "Manager","Supervisor"],
	  	name: "actions"
	  }]).then(function (answers) {
		    // Use user feedback for... whatever!! 
		   console.log(answers);
		   switch(answers.actions)
		   {
		   	 case 'Customer': 
		   	 				   	  customer.customerView();
		   	 				   	  break;
		   	 case 'Manager': 
		   	 					  getCredentials();
		   	 					  manager.managerView();
		   	 					  break;
		   	 case 'Supervisor': 
		   	 					  getCredentials();
		   	 					  supervisor.suprvisorView();
		   	 					  break;
		   	} // End Switch
		}); //End function(answers)
} //End getUserInput()




function getCredentials()
{
	inquirer.prompt(
	 [{
	  	type: "input",
	  	message: "Enter your User Id",
	  	name: "id"
	  },
	  {
	  	type: "input",
	  	message: "Enter your password",
	  	name: "pass"
	  },
	  ]).then(function(answers) {
		    // Use user feedback for... whatever!! 
		console.log(answers);
		uid = answers.id;
		password = answers.pass;
		userAuthentication(uid,password);

	}); //End function(answers)
	 
}

function userAuthentication(uid,password)
{

	var query = connection.query("select * from user where?",
		[{
			user_id: uid,
			password: password
		}],
		function(err,res)
		{
			console.log(res.length);
			if(res.length != 0)
			{
				console.log("Invalid credentials!");
			} 
			else
			{
				console.log("Log in successfully!");
			}
	});
}


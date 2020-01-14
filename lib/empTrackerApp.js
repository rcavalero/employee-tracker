// ## Submission on BCS
  // You are required to submit the following:
    // * The URL of the GitHub repository

//  *** TO DO  ***
// clean up code
// determine what validation is needed
// display figlet of Employee Manager
// setup readme

// Code starts here
const fs = require("fs");
const inquirer = require("inquirer");
const cTable = require('console.table');
// const employee = require("./employee.js");
const queries = require("./empTrackerQueries.js");
// const server = require(".././server.js");

// These are the prompt questions
const mainMenuChoices = [
  { type: "list", 
    message: "What would you like to do?", 
    choices: [
      "View All Employees",
      "View All Employees by Department",
      "View All Employees by Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "View All Departments",
      "Add Department",
      "Remove Department",
      "View Department Budget",
      "View Budget by Department",
      "Exit"], 
    name: "choice" }
];

const addEmpChoices = [
  {
    name: "f_name",
    type: "input",
    message: "What is employee's First Name?"
  },
  {
    name: "l_name",
    type: "input",
    message: "What is employee's Last Name?"
  },
  {
    name: "role",
    type: "rawlist",
    choices: function() {
      var choiceArray = [];
      for (var i = 0; i < results.length; i++) {
        choiceArray.push(results[i].item_name);
      }
      return choiceArray;
    },
message: "What role will this employee have?"
  }
];

// function prompts the user for what action they should take
// 

module.exports = {
  mainMenuChoices,
  addEmpChoices,  
};
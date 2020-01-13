// # Unit 12 MySQL Homework: Employee Tracker

// Developers are often tasked with creating interfaces that make it easy for non-developers to view and interact with information stored in databases.
//  Often these interfaces are known as **C**ontent **M**anagement **S**ystems. In this homework assignment, your challenge is to architect and build a 
//  solution for managing a company's employees using node, inquirer, and MySQL.

// ## Instructions

// Build a command-line application that at a minimum allows the user to:
  // * Add departments, roles, employees
  // * View departments, roles, employees
  // * Update employee roles

// Bonus points if you're able to:
  // * Update employee managers
  // * View employees by manager
  // * Delete departments, roles, and employees
  // * View the total utilized budget of a department -- ie the combined salaries of all employees in that department


// How do you deliver this? Here are some guidelines:
  // * Use the [MySQL](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and perform queries.
  // * Use [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user via the command-line.
  // * Use [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of `console.table`,
  // but the NPM package formats the data a little better for our purposes.
  // * You may wish to have a separate file containing functions for performing specific SQL queries you'll need to use. Could a constructor function
  // or a class be helpful for organizing these?
  // * You will need to perform a variety of SQL JOINS to complete this assignment, and it's recommended you review the week's activities if you need a
  // refresher on this.


// ### Hints
  // * Focus on getting the basic functionality completed before working on more advanced features.
  // * Review the week's activities for a refresher on MySQL.
  // * Check out [SQL Bolt](https://sqlbolt.com/) for some extra MySQL help.

// ## Minimum Requirements
  // * Functional application.
  // * GitHub repository with a unique name and a README describing the project.
  // * The command-line application should allow users to:
  //   * View departments, roles, employees
  //   * Update employee roles

// ## Bonus
// * The command-line application should allow users to:
    // * Update employee managers
    // * View employees by manager
    // * Delete departments, roles, and employees
    // * View the total utilized budget of a department -- ie the combined salaries of all employees in that department


// ## Submission on BCS
  // You are required to submit the following:
    // * The URL of the GitHub repository



//  *** TO DO  ***
// write & test add queries
// write & test delete queries
// write & test budget queries
// determine what validation is needed
// setup readme

// Code starts here
const fs = require("fs");
const inquirer = require("inquirer");
const cTable = require('console.table');
// const employee = require("./employee.js");
const queries = require("./empTrackerQueries.js");
// const server = require(".././server.js");


// Are the returns a console log or query results or returns?

// display figlet of Employee Manager

  // Add Employee
    // returns Added first_name & last_name to the database
    // Who is the employee's manager
        // provides a list of managers with "None" at the top of the list
  // Remove Employee
    // Which Employee do you want to remove (Use arrow keys)-Suffix?
      // provides list of employees to remove (concatenate first_name & Last_name)
      // after employee deleted returns "Removed employee from the database"
  // Update Employee Role
    // which employee would you like to update?
      // What is employee's new role?
        // returns a list of roles
          // "Employee's" role has been updated to "new role"
  // Update Employee Manager
    // Which Employee's manager do you want to update
      // provides list of employees first and last name
    // Which employee to you want to set as manager (need to exclude employee from list)
    // Returns Updated Employee's Manager
  // Add Role
    // What Role would you like to Add?
    // "Role" role added
  // Remove Role
    // return list of roles
      // Role removed from database
  // Add a Department
    // What department would you like to add?
      // "dept" department added
  // Remove a Department
    // which department would you like to remove?
      // Can a department be deleted if it is being used
      // Department removed from database
    // View Budget for Specific Departments
      // Gives user a list of departments
        // Returns a budget report for specified department


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
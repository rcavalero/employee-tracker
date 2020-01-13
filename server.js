const mysql = require("mysql");
const tracker = require("./lib/empTrackerApp.js");
const queries = require("./lib/empTrackerQueries.js");
// const fs = require("fs");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "pass",
  database: "employee_trackerDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  console.clear();
  // tracker.start();
  // tracker.mainMenu();
  mainMenu();
  // connection.end();
});

  // "View All Employees",
  // "View All Employees by Department",
  // "View All Employees by Manager",
  // "Add Employee",
  // "Remove Employee",
  // "Update Employee Role",
  // "Update Employee Manager",
  // "View All Roles",
  // "Add Role",
  // "Remove Role",
  // "View All Departments",
  // "Add Department",
  // "Remove Department",
  // "View Department Budget",
  // "View Budget by Department",


function mainMenu() {
  inquirer
    .prompt(tracker.mainMenuChoices)
    .then(function ({ choice }) {

      if (choice === "View All Employees") {
          connection.query(queries.viewEmployees, function (err, results) {
            if (err) throw err;
            console.table(results)
            mainMenu();
          })
      }
      else if (choice === "View All Employees by Department") {
          connection.query(queries.viewEmpByDept, function (err, results) {
            if (err) throw err;
            console.table(results)
            mainMenu();
          });
      }
      else if (choice === "View All Employees by Manager") {
          connection.query(queries.viewEmpByDept, function (err, results) {
            if (err) throw err;
            console.table(results)
            mainMenu();
          });
      } 
      else if (choice === "Add Employee") {
          addEmployee();
      } 
      else if (choice === "Remove Employee") {
          addEmployee();
      }
      else if (choice === "Update Employee Manager") {
          addEmployee();
      }
      else if (choice === "View All Roles") {
          connection.query(queries.viewRoles, function (err, results) {
            if (err) throw err;
            console.table(results)
            mainMenu();
          });
      }
      else if (choice === "Add Role") {
          addRole();
      }
      else if (choice === "Remove Role") {
          addEmployee();
      }
      else if (choice === "View All Departments") {
          connection.query(queries.viewDepartments, function (err, results) {
            if (err) throw err;
            console.table(results)
            mainMenu();
          });
      }
      else if (choice === "Add Department") {
          addDepartment();
      }
      else if (choice === "Remove Department") {
          addEmployee();
      }
      else if (choice === "View Department Budget") {
          connection.query(queries.viewDepartments, function (err, results) {
            if (err) throw err;
            console.table(results)
            mainMenu();
          });
      }
      else if (choice === "View Budget by Department") {
          connection.query(queries.viewBudgetByDept, function (err, results) {
            if (err) throw err;
            console.table(results)
            mainMenu();
          });
      }
      else {
          connection.end();
      }
    })
};

function addEmployee() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      // .prompt(tracker.addEmpChoices)
      .prompt([
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
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].title);
            }
            return choiceArray;
          },
          message: "What role will this employee have?"
        }
      ])
      .then(function (answer) {
        var empRoleId;
        for (var i = 0; i < results.length; i++) {
          if (results[i].title === answer.role) {
            empRoleId = results[i].id;
          }
        }
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.f_name,
            last_name: answer.l_name,
            role_id: empRoleId,
          },
          function (err) {
            if (err) throw err;
            console.log("New Employee Added!");
            mainMenu();
          }
        );
      });
  })
};

function addRole() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What Role would you like to add?"
        },
        {
          name: "salary",
          type: "number",
          message: "What is the Salary for this role?"
        },
        {
          name: "dept",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].name);
            }
            return choiceArray;
          },
          message: "What Department applies to this Role?"
        }
      ])
      .then(function (answer) {
        var deptId;
        for (var i = 0; i < results.length; i++) {
          if (results[i].name === answer.dept) {
            deptId = results[i].id;
          }
        }
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: deptId,
          },
          function (err) {
            if (err) throw err;
            console.log(answer.title+" has been added to the database for the "+answer.dept+ " Department!");
            mainMenu();
          }
        );
      });
  })
};

function addDepartment() {
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
      ])
      .then(function ({name}) {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: name,
          },
          function (err) {
            if (err) throw err;
            console.log(name+" department added to database!");
            mainMenu();
          }
        );
      });
};

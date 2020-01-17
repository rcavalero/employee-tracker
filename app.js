// ## Submission on BCS
// You are required to submit the following:
// * The URL of the GitHub repository

//  *** TO DO  ***
// clean up code
// show roles that will be deleted when dept is removed
// display figlet of Employee Manager
// consider chalk-pipe
// setup readme

// Code starts here
var connection = require("./lib/server");
const fs = require("fs");
const inquirer = require("inquirer");
const cTable = require('console.table');
const chalkPipe = require('chalk-pipe');
const warning = chalkPipe('orange.bold');
// const employee = require("./employee.js");
const queries = require("./lib/sql.js");

// These are the prompt questions
const mainMenuChoices = [
  {
    type: "rawlist",
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
      // "Remove Department",
      "View Department Budget",
      "View Budget by Department",
      "Exit"],
    name: "choice",
    pageSize: 17
  }
];

function start() {
  console.clear();
  console.log(warning("Welcome to Employee Tracker"));
  mainMenu();
};

start();

// prompts the user for what action they want to take
// todo make this a switch statement
function mainMenu() {
  inquirer
    .prompt(mainMenuChoices)
    .then(function ({ choice }) {

      switch (choice) {
      
        case "View All Employees":
          viewInfo(queries.viewEmployees);
          break;
        case "View All Employees by Department":
          viewInfo(queries.viewEmpByDept);
          break;
        case "View All Employees by Manager":
          viewInfo(queries.viewEmpByMgr);
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          confirmRemoveEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "View All Roles":
          viewInfo(queries.viewRoles);
          break;
        case "Add Role":
          addRole();
          break;
        case "Remove Role":
          confirmRemoveRole();
          break;
        case "View All Departments":
          viewInfo(queries.viewDepartments);
          break;
        case "Add Department":
          addDepartment();
          break;
        // case "Remove Department":
        //   removeDepartment();
        //   break;
        case "View Department Budget":
          viewDepartmentBudget();
          break;
        case "View Budget by Department":
          viewInfo(queries.viewBudgetByDept);
          break;
        case "Exit":
          connection.end();
          break;
        default:
          mainMenu();
      }
    })
};

function viewInfo(sql) {
  console.clear();
  connection.query(sql, function (err, results) {
    if (err) throw err;
    console.table(results)
    mainMenu();
    // connection.end()
  })
};
function addEmployee() {
  console.clear();
  console.log(warning("Adding new Employee:"));
  connection.query("SELECT * FROM role", function (err, roles) {
    if (err) throw err;
    const roleList = roles.map(role => ({ name: role.title, value: role.id }));
    connection.query("SELECT * FROM employee", function (err, managers) {
      if (err) throw err;
      const mgrList = managers.map(manager => ({ name: manager.first_name + ' ' + manager.last_name, value: manager.id }));
      const noMgr = { name: "None", value: "None" };
      mgrList.unshift(noMgr);
      inquirer
        .prompt(
          [
          {
            name: "f_name",
            type: "input",
            message: "What is new employee's First Name?",
            validate: validateInput
          },
          {
            name: "l_name",
            type: "input",
            message: "What is new employee's Last Name?",
            validate: validateInput
          },
          {
            name: "roleId",
            type: "rawlist",
            choices: roleList,
            message: "What is new employee's role?",
            pageSize: 10
          },
          {
            name: "mgrId",
            type: "rawlist",
            choices: mgrList,
            message: "Who is new employee's Manager?",
            pageSize: 10
          }
        ])
        .then(function (answer) {
          if (answer.mgrId === "None") {
            answer.mgrId = null
          } else { answer.mgrId };

          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.f_name,
              last_name: answer.l_name,
              role_id: answer.roleId,
              manager_id: answer.mgrId
            },
            function (err) {
              if (err) throw err;
              console.clear();
              console.log("New Employee " + answer.f_name + " " + answer.l_name + " has been added!");
              mainMenu();
            }
          );
        });
    })
  })
};

function confirmRemoveEmployee() {
  console.clear();
  connection.query(queries.employeesForDeletion, function (err, results) {
    if (results.length <1){
      console.log(warning("Only Employees not designated as a Manager are eligible for removal."));
      console.log(warning("No Employees are eligible for removal."));
      mainMenu();
      return;
      }

    const empList = results.map(employee => ({ Name: employee.Employee, Dept: employee.Dept, Title: employee.Title }));
    console.table(empList);
    if (err) throw err;
  inquirer
    .prompt([
      {
        name: "removeEmp",
        type: "confirm",
        message: warning("Only employees not designated as a Manager are eligible for removal, proceed?")
      }
    ])
    .then(function ({ removeEmp }) {

      if (removeEmp === true) {
        removeEmployee();
      }
      else {
        mainMenu();
      }
    });
  })
};

function removeEmployee() {
  connection.query(queries.employeesForDeletion, function (err, results) {
    if (err) throw err;
    const empList = results.map(employee => ({ name: employee.Employee, value: employee.id }));
    inquirer
      .prompt([
        {
          name: "empId",
          type: "rawlist",
          choices: empList,
          message: "Which Employee would you like to remove?",
          pageSize: 10
        }
      ])
      .then(function ({ empId }) {
        connection.query(
          "DELETE FROM employee WHERE ?",
          {
            id: empId
          },
          function (err) {
            if (err) throw err;
            console.clear();
            console.log(warning("Employee has been removed!"));
            mainMenu();
          }
        );
      });
  })
};

function updateEmployeeRole() {
  console.clear();
  console.log(warning("Updating Employee Role"));
  
  connection.query("SELECT * from employee", function (err, results) {
    if (err) throw err;
    const empList = results.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
    inquirer
      .prompt([
        {
          name: "empId",
          type: "rawlist",
          choices: empList,
          message: "Which Employee would you like to update?",
          pageSize:10
        }
      ])
      .then(function (employee) {
        connection.query("SELECT * FROM role", function (err, results) {
          if (err) throw err;
          const roleList = results.map(role => ({ name: role.title, value: role.id }));
          inquirer
            .prompt([
              {
                name: "roleId",
                type: "rawlist",
                choices: roleList,
                message: "What is Employee's new Role?",
                pageSize: 10
              }]
            ).then(function (newRole) {
              connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                  {
                    role_id: newRole.roleId
                  },
                  {
                    id: employee.empId
                  }
                ],
                function (err) {
                  if (err) throw err;
                  console.clear();
                  console.log(warning("Role has been updated for this employee!"));
                  mainMenu();
                }
              );
            });

        })
      })
  })
};

function updateEmployeeManager() {
  console.clear();
  console.log(warning("Updating Employee Manager"));
  
  connection.query("SELECT * from employee", function (err, results) {
    if (err) throw err;
    const empList = results.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
    inquirer
      .prompt([
        {
          name: "empId",
          type: "rawlist",
          choices: empList,
          message: "Which Employee would you like to update?",
          pageSize: 10
        }
      ])
      .then(function (employee) {
        connection.query("SELECT * from employee", function (err, results) {
          if (err) throw err;
          const mgrList = results.map(manager => ({ name: manager.first_name + ' ' + manager.last_name, value: manager.id }));
          const noMgr = { name: "None", value: "None" };
          mgrList.unshift(noMgr);
          inquirer
            .prompt([
              {
                name: "mgrId",
                type: "rawlist",
                choices: mgrList,
                message: "Who is Employee's new Manager?",
                pageSize: 10
              }]
            ).then(function (newMgrId) {
              if (newMgrId.mgrId === "None") {
                newMgrId.mgrId = null
              } else { newMgrId.mgrId };

              connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                  {
                    manager_id: newMgrId.mgrId
                  },
                  {
                    id: employee.empId
                  }
                ],
                function (err) {
                  if (err) throw err;
                  console.clear();
                  console.log(warning("Manager has been updated for this employee!"));
                  mainMenu();
                }
              );
            });
        })
      })
  })
};

function addRole() {
  console.clear();
  console.log(warning("Adding new Role:"));
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    const deptList = results.map(dept => ({ name: dept.name, value: dept.id }));
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What Role would you like to add?",
          validate: validateInput
        },
        {
          name: "salary",
          type: "input",
          message: "What is the Salary for this role?",
          validate: function (value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
          }
        },
        {
          name: "deptId",
          type: "rawlist",
          choices: deptList,
          message: "What Department applies to this Role?",
          pageSize: 10
        }
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.deptId,
          },
          function (err) {
            if (err) throw err;
            console.clear();
            console.log(warning(answer.title + " has been added!"));
            mainMenu();
          }
        );
      });
  })
};

function confirmRemoveRole() {
  console.clear();
  connection.query(queries.rolesForDeletion, function (err, results) {
    if (results.length <1){
      console.log("Only Roles not assigned to employees are eligible for removal.");
      console.log("No Roles are eligible for removal.");
      mainMenu();
      return;
      }
    const roleList = results.map(role => ({ Title: role.title, Department: role.Department}));
    console.table(roleList);
    if (err) throw err;
  inquirer
    .prompt([
      {
        name: "remRole",
        type: "confirm",
        message: "Only roles not assigned to employees are eligible for removal, proceed?"
      }
    ])
    .then(function ({ remRole }) {
        // console.log(remRole);
        
      if (remRole === true) {
        removeRole();
      }
      else {
        mainMenu();
      }
    });
  })
};

function removeRole() {
  console.clear();
  connection.query(queries.rolesForDeletion, function (err, results) {
    if (err) throw err;

    const roleList = results.map(role => ({ name: role.title, value: role.id }));
    inquirer
      .prompt([
        {
          name: "roleId",
          type: "rawlist",
          choices: roleList,
          message: "Which Role would you like to remove?",
          pageSize: 10
        }
      ])
      .then(function ({ roleId }) {

        connection.query(
          "DELETE FROM role WHERE ?",
          {
            id: roleId
          },
          function (err) {
            if (err) throw err;
            console.clear();
            console.log("Role has been removed!");
            mainMenu();
          }
        );
      });
  })
};

function addDepartment() {
  console.clear();
  console.log(warning("Adding new Department:"));
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?",
        validate: validateInput
      }
    ])
    .then(function ({ name }) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: name,
        },
        function (err) {
          if (err) throw err;
          console.clear();
          console.log(warning(name + " department has been added!"));
          mainMenu();
        }
      );
    });
};

function confirmRemoveDepartment() {
  inquirer
    .prompt([
      {
        name: "removeDept",
        type: "confirm",
        message: "Roles associated with the selected Department will be removed also, proceed?"
      }
    ])
    .then(function ({ removeDept }) {

      if (removeDept === true) {
        removeDepartment();
      }
      else {
        mainMenu();
      }
    });
};

function removeDepartment() {
  console.clear();
  console.log(warning("Only Departments not assigned to Employees can be removed."));
  connection.query(queries.deptsForDeletion, function (err, results) {
    if (err) throw err;
    if (results.length <1){
      console.log("No departments are eligible for removal.");
      mainMenu();
      return;
      }
    const deptList = results.map(department => ({ name: department.name, value: department.id }));

    inquirer
      .prompt([
        {
          name: "deptId",
          type: "rawlist",
          choices: deptList,
          message: "Which Department would you like to remove?",
          pageSize: 10
        }
      ])
      .then(function ({ deptId }) {
        connection.query(`SELECT role.id, role.title, dept.name Department FROM department dept JOIN role ON dept.id = role.department_id WHERE dept.id = ${deptId};`, function (err, roles) {
          if (err) throw err;
          const roleList = roles.map(role => ({ Title: role.title }));
          console.table(roleList);

        inquirer
        .prompt([
          {
            name: "removeDept",
            type: "confirm",
            message: warning("Above Roles associated with the selected Department will be removed also, proceed?")
          }
        ])
        .then(function ({ removeDept }) {
    
          if (removeDept === false) {
            mainMenu();
            return;
          }
        // })
        connection.query(
          "DELETE FROM department WHERE ?",
          {
            id: deptId
          },
          function (err) {
            if (err) throw err;
            console.clear();
            console.log(warning("Department has been removed!"));
            mainMenu();
          });
        });  
      });
    });
  });
};

function viewDepartmentBudget() {
  console.clear();
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    const deptList = results.map(department => ({ name: department.name, value: department.id }));
    inquirer
      .prompt([
        {
          name: "deptId",
          type: "rawlist",
          choices: deptList,
          message: warning("Which Department's Budget would you like to see?"),
          pageSize: 10
        }
      ])
      .then(function ({ deptId }) {
        connection.query(`SELECT name "Department", concat('$',format(sum(salary),0)) Budget FROM department dept JOIN role ON dept.id = role.department_id join employee emp ON role.id = emp.role_id WHERE dept.id = ${deptId} GROUP BY name;`, function (err, results) {
          if (err) throw err;
          if (results.length <1){
            console.log(warning("Selected Department has no employees."));
            mainMenu();
            return;
            }
                console.table(results)
          mainMenu();
        });
      });
  })
};

function validateInput(text) {
  if (text === '*') {
    return mainMenu();
  }
  else if (text != '') {
    return true;
  }
  return "Field cannot be blank";
};

// module.exports = {
//   mainMenuChoices
// };
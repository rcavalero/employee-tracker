const mysql = require("mysql");
const tracker = require("./lib/empTrackerApp.js");
const queries = require("./lib/empTrackerQueries.js");
// const fs = require("fs");
const inquirer = require("inquirer");
// const cTable = require('console.table');

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

// "Add Employee",  need to add code to add manager
// "Remove Employee",
// "Update Employee Manager",
// "View Department Budget",


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
        connection.query(queries.viewEmpByMgr, function (err, results) {
          if (err) throw err;
          console.table(results)
          mainMenu();
        });
      }
      else if (choice === "Add Employee") {
        addEmployee();
      }
      else if (choice === "Remove Employee") {
        removeEmployee();
      }
      else if (choice === "Update Employee Role") {
        updateEmployeeRole();
      }
      else if (choice === "Update Employee Manager") {
        updateEmployeeManager();
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
        removeRole();
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
        confirmRemoveDepartment();
      }
      else if (choice === "View Department Budget") {
        viewDepartmentBudget();
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
  connection.query("SELECT * FROM role", function (err, roles) {
    if (err) throw err;
    const roleInfo = roles.map(role => ({ name: role.title, value: role.id}));
  connection.query("SELECT * FROM employee", function (err, managers) {
      if (err) throw err;
      const mgrInfo = managers.map(manager => ({ name: manager.first_name+' '+ manager.last_name, value: manager.id}));
      const noMgr = {name:"None", value: "None"};
      mgrInfo.unshift(noMgr);
      console.log(mgrInfo);
      
      
      inquirer
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
          name: "roleId",
          type: "rawlist",
          choices: roleInfo,
          message: "What role will this employee have?"
        },
        {
          name: "mgrId",
          type: "rawlist",
          choices: mgrInfo,
          message: "What Manager will this employee have?"
        }
      ])
      .then(function (answer) {
        if (answer.mgrId === "None") {
          answer.mgrId = null
      } else {answer.mgrId};

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
            console.log("New Employee " + answer.f_name + " " + answer.l_name + "has been added!");
            mainMenu();
          }
        );
      });
    })
  })
};

function removeEmployee() {
  connection.query(queries.employeesToUpdate, function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "empId",
          type: "rawlist",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              let empInfo = {
                name: results[i].Employee,
                value: results[i].id
              };

              choiceArray.push(empInfo);
            }
            return choiceArray;
          },
          message: "Which Employee would you like to remove?"
        }
      ])
      .then(function (answer) {

        connection.query(
          "DELETE FROM employee WHERE ?",
          {
            id: answer.empId
          },
          function (err) {
            if (err) throw err;
            console.log("Employee has been deleted from the database!");
            mainMenu();
          }
        );
      });
  })
};

function updateEmployeeRole() {
  connection.query(queries.employeesToUpdate, function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "empId",
          type: "rawlist",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              let empInfo = {
                name: results[i].Employee,
                value: results[i].id
              };

              choiceArray.push(empInfo);
            }
            return choiceArray;
          },
          message: "Which Employee would you like to update?"
        }
      ])
      .then(function (employee) {
        connection.query("SELECT * FROM role", function (err, results) {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: "roleId",
                type: "rawlist",
                choices: function () {
                  let roleArray = [];
                  for (let i = 0; i < results.length; i++) {
                    let roleInfo = {
                      name: results[i].title,
                      value: results[i].id
                    };

                    roleArray.push(roleInfo);
                  }
                  return roleArray;

                },
                message: "What is Employee's new Role?"
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
                  console.log("Role has been updated for this employee in the database!");
                  mainMenu();
                }
              );
            });

        })
      })
  })
};

function updateEmployeeManager() {
  connection.query(queries.employeesToUpdate, function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "empId",
          type: "rawlist",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              let empInfo = {
                name: results[i].Employee,
                value: results[i].id
              };

              choiceArray.push(empInfo);
            }
            return choiceArray;
          },
          message: "Which Employee would you like to update?"
        }
      ])
      .then(function (employee) {
        connection.query(queries.employeesToUpdate, function (err, results) {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: "mgrId",
                type: "rawlist",
                choices: function () {
                  let mgrArray = [{ name: 'None', value: "None"  }];
                  for (let i = 0; i < results.length; i++) {
                    let mgrInfo = {
                      name: results[i].Employee,
                      value: results[i].id
                    };

                    mgrArray.push(mgrInfo);
                  }
                  console.log(mgrArray);
                  
                  return mgrArray;

                },
                message: "Who is Employee's new Manager?"
              }]
            ).then(function (newMgrId) {
              if (newMgrId.mgrId === "None") {
                  newMgrId.mgrId = null
              } else {newMgrId.mgrId};
              
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
                  console.log("Role has been updated for this employee in the database!");
                  mainMenu();
                }
              );
            });

        })
      })
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
          name: "deptId",
          type: "rawlist",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              let deptInfo = {
                name: results[i].name,
                value: results[i].id
              };

              choiceArray.push(deptInfo);
            }
            return choiceArray;
          },
          message: "What Department applies to this Role?"
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
            console.log(answer.title + " has been added to the database!");
            mainMenu();
          }
        );
      });
  })
};

function removeRole() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "roleId",
          type: "rawlist",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              let roleInfo = {
                name: results[i].title,
                value: results[i].id
              };

              choiceArray.push(roleInfo);
            }
            return choiceArray;
          },
          message: "Which Role would you like to remove?"
        }
      ])
      .then(function (answer) {

        connection.query(
          "DELETE FROM role WHERE ?",
          {
            id: answer.roleId
          },
          function (err) {
            if (err) throw err;
            console.log("Role has been deleted from the database!");
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
    .then(function ({ name }) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: name,
        },
        function (err) {
          if (err) throw err;
          console.log(name + " department added to database!");
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
    .then(function (answer) {

      if (answer.removeDept === true) {
        removeDepartment();
      }
      else {
        mainMenu();
      }
    });
};

function removeDepartment() {
  connection.query(queries.deptsForDeletion, function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "deptId",
          type: "rawlist",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              let deptInfo = {
                name: results[i].name,
                value: results[i].id
              };

              choiceArray.push(deptInfo);
            }
            return choiceArray;
          },
          message: "Which Department would you like to remove?"
        }
      ])
      .then(function (answer) {
        connection.query(
          "DELETE FROM department WHERE ?",
          {
            id: answer.deptId
          },
          function (err) {
            if (err) throw err;
            console.log("Department has been deleted from the database!");
            mainMenu();
          }
        );
      });
  })
};

function viewDepartmentBudget() {
  connection.query("SELECT * FROM department", function (err, departments) {
    if (err) throw err;
    const deptList = departments.map(department => ({ name: department.name, value: department.id}));
    inquirer
      .prompt([
        {
          name: "deptId",
          type: "rawlist",
          choices: deptList,
          message: "Which Department's Budget would you like to see?"
        }
      ])
      .then(function ({deptId}) {
        console.log(deptId);
        
        connection.query(`SELECT name "Department", concat('$',format(sum(salary),0)) Budget FROM department dept JOIN role ON dept.id = role.department_id WHERE dept.id = ${deptId} GROUP BY name;`, function (err, results) {
          if (err) throw err;
          console.table(results)
          mainMenu();
        });
      });
  })
};

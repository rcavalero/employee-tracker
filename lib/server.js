const mysql = require("mysql");
// const app = require("./lib/empTrackerApp.js");
// const queries = require("./lib/empTrackerQueries.js");
// const fs = require("fs");
// const inquirer = require("inquirer");
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
  // console.log("connected as id " + connection.threadId + "\n");
  // connection.end();
});


module.exports = connection;
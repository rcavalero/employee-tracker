const mysql = require("../server.js");


class Employee {
    constructor(first_name, last_name, role_id, manager_id) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }

getName(emp) {
     return this.name;
}

viewEmployees(){
    mysql.connection.query("SELECT * FROM employee", function(err, results) {
        if (err) throw err;

    })
}

}
  
module.exports = Employee;
  
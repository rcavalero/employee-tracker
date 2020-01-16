var connection = require("./server");

const tools = {

getEmployeeList() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        const mgrList = results.map(manager => ({ name: manager.first_name + ' ' + manager.last_name, value: manager.id }));
        console.log(mgrList)
    }
    )
    return results;
}
};

module.exports = tools;
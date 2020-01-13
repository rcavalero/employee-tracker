

  // "Add Employee",
  // "Remove Employee",
  // "Update Employee Role",
  // "Update Employee Manager",
  // "Add Role",
  // "Remove Role",
  // "Add Department",
  // "Remove Department",


// View All Employees
// const viewEmployees = `Select first_name "First Name", last_name "Last Name", dept.name Dept, title Title, CONCAT('$',format(salary,0)) Salary FROM employee emp left JOIN role ON emp.role_id = role.id left JOIN department dept ON role.department_id = dept.id;`
const viewEmployees = `Select CONCAT(emp.first_name, ' ', emp.last_name) Employee, dept.name Dept, title Title, CONCAT('$',format(salary,0)) Salary, CONCAT(mgr.first_name, ' ', mgr.last_name) Manager FROM employee emp left JOIN role ON emp.role_id = role.id left JOIN department dept ON role.department_id = dept.id LEFT JOIN employee mgr ON emp.manager_id = mgr.id;`

// "View All Employees by Department",
const viewEmpByDept = `SELECT name "Department", CONCAT(first_name, ' ', last_name) Employee FROM department dept JOIN role ON dept.id = role.department_id JOIN employee ON role.id = employee.role_id;` 
  
  // "View All Employees by Manager",
const viewEmpByMgr = `SELECT CONCAT(mgr.first_name, ' ', mgr.last_name) Manager, CONCAT(emp.first_name, ' ', emp.last_name) Employee  FROM employee mgr JOIN employee emp ON mgr.id = emp.manager_id;`

// employees to update
const employeesToUpdate = `SELECT id, CONCAT(emp.first_name, ' ', emp.last_name) Employee FROM employee emp ;`

// view roles
const viewRoles = "SELECT title Title, concat('$',format(salary,0)) Salary from role;"

  // view departments
const viewDepartments = "SELECT name Department from department;"

// departments eligible for deletion
const deptsForDeletion = `SELECT dept.id, dept.name FROM department dept LEFT JOIN role ON dept.id = role.department_id LEFT JOIN employee emp ON dept.id = emp.role_id WHERE emp.id IS NULL;`

// delete department
const delDepartment = 'delete from department where name = "collections";'

// "View Department Budget",


// "View Budget by Department",
const viewBudgetByDept = `SELECT name "Department", concat('$',format(sum(salary),0)) Budget FROM department dept JOIN role ON dept.id = role.department_id GROUP BY name;`



module.exports = {
    viewEmployees,
    viewEmpByDept,
    viewEmpByMgr,
    employeesToUpdate,
    viewRoles,
    viewDepartments,
    deptsForDeletion,
    viewBudgetByDept
}
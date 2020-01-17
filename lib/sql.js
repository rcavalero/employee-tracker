

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
const viewEmployees = `Select CONCAT(emp.first_name, ' ', emp.last_name) Employee, dept.name Dept, title Title, CONCAT('$',format(salary,0)) Salary, ifnull(CONCAT(mgr.first_name, ' ', mgr.last_name),"") Manager FROM employee emp left JOIN role ON emp.role_id = role.id left JOIN department dept ON role.department_id = dept.id LEFT JOIN employee mgr ON emp.manager_id = mgr.id;`

// "View All Employees by Department",
const viewEmpByDept = `SELECT name "Department", CONCAT(first_name, ' ', last_name) Employee FROM department dept JOIN role ON dept.id = role.department_id JOIN employee ON role.id = employee.role_id;` 
  
  // "View All Employees by Manager",
const viewEmpByMgr = `SELECT CONCAT(mgr.first_name, ' ', mgr.last_name) Manager, CONCAT(emp.first_name, ' ', emp.last_name) Employee  FROM employee mgr JOIN employee emp ON mgr.id = emp.manager_id ORDER BY manager, employee;`

// employees to update
const employeesToUpdateMgr = `SELECT id, CONCAT(emp.first_name, ' ', emp.last_name) Employee FROM employee emp ;`

// employees to delete (cannot be designated as a manager)
const employeesForDeletion = `SELECT emp.id, CONCAT(emp.first_name, ' ', emp.last_name) Employee, dept.name Dept, title Title FROM employee emp  left JOIN employee mgr ON emp.id = mgr.manager_id  join role on emp.role_id = role.id join department dept on role.department_id = dept.id where mgr.id is null ;`

// view roles
const viewRoles = "SELECT title Title, concat('$',format(salary,0)) Salary, dept.name Department from role JOIN department dept on role.department_id = dept.id;"

// roles eligible for deletion
const rolesForDeletion = `SELECT role.id, role.title, dept.name Department FROM role LEFT JOIN employee emp ON role.id = emp.role_id LEFT JOIN department dept ON role.department_id = dept.id WHERE emp.id IS NULL;`

  // view departments
const viewDepartments = "SELECT name Department from department;"

// departments eligible for deletion  (cannot be tied to an employee)
const deptsForDeletion = `SELECT dept.id, dept.name FROM department dept LEFT JOIN role ON dept.id = role.department_id LEFT JOIN employee emp ON dept.id = emp.role_id WHERE emp.id IS NULL GROUP BY dept.name;`

// roles that will be deleted with dept
const rolesForDeptDeletion = `SELECT role.id, role.title, dept.name Department FROM department dept JOIN role ON dept.id = role.department_id WHERE dept.id IS ;`

// "View Department Budget",
// const viewDeptBudget = `SELECT name "Department", concat('$',format(sum(salary),0)) Budget FROM department dept JOIN role ON dept.id = role.department_id WHERE dept.id = ${deptId} GROUP BY name;`

// "View Budget by Department",
const viewBudgetByDept = `SELECT name "Department", concat('$',format(sum(salary),0)) Budget FROM department dept JOIN role ON dept.id = role.department_id JOIN employee emp on role.id = emp.role_id GROUP BY name;`


module.exports = {
    viewEmployees,
    viewEmpByDept,
    viewEmpByMgr,
    employeesToUpdateMgr,
    employeesForDeletion,
    viewRoles,
    rolesForDeletion,
    viewDepartments,
    deptsForDeletion,
    viewBudgetByDept
}
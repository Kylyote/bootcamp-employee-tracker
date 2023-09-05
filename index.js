// Import needed modules
const inquirer = require ('inquirer');
const mysql = require ('mysql2');

// Create login credentials 
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password', // insecure but this isn't being deployed nor will be public facing running anything critical
    database: 'employee_db'
  },
console.log('Connected to employee_db.')
);

// Create menu the user will first see which will lead to a bunch of choices
function startMenu(){
  inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'userMC', // user Menu Choice
      choices: ['View All Departments','View All Roles','View All Employees','Add a Department','Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit'],
    }
  ])
  .then((response) => {
    if (response.userMC === 'View All Departments'){
      viewDepartment();
    } else if (response.userMC === 'View All Roles'){
      viewRoles();

    } else if(response.userMC === 'View All Employees'){
      viewEmployees();

    } else if (response.userMC === 'Add a Department'){
      addDepart();

    } else if (response.userMC === 'Add a Role'){
      addRole();

    } else if (response.userMC === 'Add an Employee') {
      addEmployee();

    } else if (response.userMC === 'Update an Employee Role') {
      updateEmployee();

    } else {
      // ends connection and returns to terminal screen.
      console.log()
      db.end();

    }
  })
}

// View tables functions. These functions will be used to view tables
function viewDepartment() {
  db.query('SELECT * FROM departments', function(err, results) { 
    if (err) console.log(err);
    console.table(results);
    startMenu();
    return;
  })
}
function viewRoles() {
  db.query('SELECT * FROM roles', function(err, results) { 
    if (err) console.log(err);
    console.table(results);
    startMenu();
    return;
  })
}
function viewEmployees() {
  db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees JOIN roles ON employees.title = roles.id JOIN departments ON roles.department = departments.id LEFT JOIN employees AS manager ON employees.manager = manager.id;", function(err, results) { 
    if (err) console.log(err);
    console.table(results);
    startMenu();
    return;
  })
}

// Function that will take user input and add a new department, after which it will call viewDepartment() so the user can see their addition then return to the startMenu().
function addDepart() {
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the new department?',
      name: "departName"
    }
  ])
  .then((response) => {
    db.query('INSERT INTO departments VALUES ?', response.departName, (err, result) => {
      if(err) console.log(err);
      console.log('Department Result', result);
    });
  });
  viewDepartment();
}

// Function that will take user input and add a new role to the roles table, then it will call viewRoles() to show the changes, then go back to the startMenu().
function addRole (){
  db.query('SELECT departments.id, departments.department_name FROM departments', (err, res) => {
    if (err) throw err;
    let departList = [];
    // Store departments from query into an array
    res.forEach((department) => {
      departList.push({
        name: department.department_name,
        value: department.id,
      });
    });
      // Ask the user some questions.
    inquirer.prompt([
      {
        type: 'input',
        message: 'What is the role you want to add?',
        name: 'roleName'
      },
      {
        type: 'input',
        message: 'What is the yearly salary for this role?',
        name: 'roleSalary'
      },
      {
        type: 'list',
        message: 'What department is this in? ',
        choices: departList,
        name: 'departID'
      },
    ]).then((response) => {
      console.log(response);
      db.query('INSERT INTO roles (title, department, salary) VALUES (?, ?, ?)', [response.roleName, response.departID, response.roleSalary], (err, result) => {
        if (err) console.log(err);
        console.log("Role Result", result);
      });
      viewRoles();
    })
    });

}

// Function that will take user input and create a new employee with department and roles. 
function addEmployee(){
  inquirer.prompt([
    {

    }
  ]);
}
startMenu();
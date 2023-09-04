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
      return;
    } else if (response.userMC === 'View All Roles'){
      viewRoles();
      return;
    } else if(response.userMC === 'View All Employees'){
      viewEmployees();
      return;
    } else if (response.userMC === 'Add a Department'){
      addDepart();
      return;
    } else if (response.userMC === 'Add a Role'){
      addRole();
      return;
    } else if (response.userMC === 'Add an Employee') {
      addEmployee();
      return;
    } else if (response.userMC === 'Update an Employee Role') {
      updateEmployee();
      return;
    } else {
      quitMenu();
      return;
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
  db.query('SELECT * FROM employees', function(err, results) { 
    if (err) console.log(err);
    console.table(results);
    startMenu();
    return;
  })
}

// function to quit mySQL and return to the main terminal
function quitMenu(){
  db.end();
  return;
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
  startMenu();
}

// Function that will take user input and add a new role to the roles table, then it will call viewRoles() to show the changes, then go back to the startMenu().
function addRole (){
  inquirer.prompt([
    {
      type: 'input',

    }
  ]);
  viewRoles();
  startMenu();
}

// Function that will take user input and create a new employee with department and roles. 
function addEmployee(){
  inquirer.prompt([
    {

    }
  ]);
}
startMenu();
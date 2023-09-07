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
  db.query("SELECT employees.id, employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS 'Job Title', departments.department_name AS Department, roles.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employees JOIN roles ON employees.title = roles.id JOIN departments ON roles.department = departments.id LEFT JOIN employees AS manager ON employees.manager = manager.id;", function(err, results) { 
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
    db.query('INSERT INTO departments VALUES ?;', response.departName, (err, result) => {
      if(err) console.log(err); 
      console.log('Department Result', result);
    });
  });
  viewDepartment();
}

// Function that will take user input and add a new role to the roles table, then it will call viewRoles() to show the changes, then go back to the startMenu().
function addRole (){
  let departList = [];
  db.query('SELECT departments.id, departments.department_name FROM departments;', (err, res) => {
    if (err) throw err;
    // Store departments from query into an array
    res.forEach((department) => {
      // Adding name and value in like this makes inquirer show the name but save the value. This works since MySQL is expecting a value but people read things as names.
      departList.push({
        name: department.department_name,
        value: department.id,
      });
    });
  });
  // Ask the user some questions. departList is added in so that the proper list of departments is shown. 
  departList.push('New Department');
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
    }
  ])
  .then((response) => {
    console.log(response);
    db.query('INSERT INTO roles (title, department, salary) VALUES (?, ?, ?);', [response.roleName, response.departID, response.roleSalary], (err, result) => {
      if (err) console.log(err);
      console.log("Role Result", result);
    });
    viewRoles();
  })
}

// Function that will take user input and create a new employee with department and roles. 
function addEmployee(){
  // Make array with names and values for the new employee department.
  let departList = [];
  db.query('SELECT departments.id, departments.department_name FROM departments;', (err, res) => {
    if (err) throw err;
    // Store departments from query into an array
    res.forEach((department) => {
      // Adding name and value in like this makes inquirer show the name but save the value. This works since MySQL is expecting a value but people read things as names.
      departList.push({
        name: department.department_name,
        value: department.id,
      });
    });
  });
  // Make array with names and values for the new employee role.
  let roleList = [];
  db.query('SELECT roles.id, roles.title FROM roles;', (err, res) => {
    if (err) throw err;
    // Store roles from query into an array
    res.forEach((role) => {
      // Adding name and value in like this makes inquirer show the name but save the value. This works since MySQL is expecting a value but people read things as names.
      roleList.push({
        name: role.title,
        value: role.id,
      });
    });
  });
  // Make list of all managers
  let manList = [];
  db.query("SELECT employees.id, CONCAT(employees.first_name,' ', employees.last_name) AS manager FROM employees;", (err, res) => {
    if (err) throw (err);
    res.forEach((manager) => {
      manList.push({
        name: manager.manager,
        value: manager.id
      });
    });
  });
  console.log(departList);
  inquirer.prompt([
    {
      type:'input',
      message: 'What is the employee\'s first name?',
      name: 'fName'
    },
    {
      type: 'input',
      message: 'What is the employee\'s last name?',
      name: 'lName'
    },
    {
      type: 'list',
      message: 'What role does the new employee have?',
      choices: roleList,
      name: 'employRole'
    },
    {
      type: 'list',
      message: 'Who is the employee\'s manager?',
      choices: manList,
      name: 'employMan'
    }
  ])
  .then((response) => {
    db.query('INSERT INTO employees (first_name, last_name, title, manager) VALUES (?, ?, ?, ?);',[response.fName, response.lName, response.employRole, response.employMan], (err, result) => {
      if (err) console.log(err);
      console.log('Employee Result', result);
    });
    viewEmployees();
  }

  );
}

// Change the role of an employee.
function updateEmployee(){
  // Show list of employees and their titles. 
  let employList = [];
  db.query("SELECT CONCAT(employees.first_name,' ',employees.last_name) as name, employees.id FROM employees;", (err, response) => {
    if (err) throw (err);
    response.forEach((employee) => {
      employList.push({
        name: employee.name,
        value: employee.id
      });
    });
  });

  let roleList = [];
  db.query('SELECT roles.id, roles.title FROM roles;', (err, res) => {
    if (err) throw err;
    // Store roles from query into an array
    res.forEach((role) => {
      // Adding name and value in like this makes inquirer show the name but save the value. This works since MySQL is expecting a value but people read things as names.
      roleList.push({
        name: role.title,
        value: role.id,
      });
    });
  });

  // Need to add the Timeout function since the employList is not filled out in time. Users will not notice the tenth of a second delay. 
  setTimeout(() => {
    inquirer.prompt([
    {
      type: 'list',
      message: 'What employee needs to be updated?',
      choices: employList,
      name: 'employee'
    },
    {
      type: 'list',
      message: 'What the employee\'s new role?',
      choices: roleList,
      name: 'role'
    }
  ])
  .then((response) => {
    console.log('Info from Inquirer', response);
    db.query('UPDATE employees SET title = ? WHERE id = ?;', [response.role, response.employee], (err, res) => {
      if (err) throw err;
      console.log('Employee Changed', res);
    });
    viewEmployees();
  })}, 100);
}
startMenu();
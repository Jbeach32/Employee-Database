const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'company_db',
});


const queryAsync = util.promisify(connection.query).bind(connection);


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
  runApp();
});


function runApp() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
      }
    });
}


function viewAllDepartments() {
  const query = 'SELECT id, name FROM departments';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runApp();
  });
}

function viewAllRoles() {
  const query = `
  SELECT r.id AS 'Role ID', r.title AS 'Title', r.salary AS 'Salary', d.name AS 'Department'
  FROM roles r
  LEFT JOIN departments d ON r.department_id = d.id
`;
connection.query(query, (err, res) => {
  if (err) throw err;
  console.table(res);
  runApp();
});
}

function viewAllEmployees() {
  const query = `
  SELECT 
    e.id AS 'Employee ID',
    e.first_name AS 'First Name',
    e.last_name AS 'Last Name',
    r.title AS 'Job Title',
    d.name AS 'Department',
    r.salary AS 'Salary',
    CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
  FROM employees e
  LEFT JOIN roles r ON e.role_id = r.id
  LEFT JOIN departments d ON r.department_id = d.id
  LEFT JOIN employees m ON e.manager_id = m.id
`;
connection.query(query, (err, res) => {
  if (err) throw err;
  console.table(res);
  runApp();
});
}

function addDepartment() {
  inquirer
  .prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the new department:',
  })
  .then((answer) => {
    const query = 'INSERT INTO departments (name) VALUES (?)';
    connection.query(query, [answer.name], (err, res) => {
      if (err) throw err;
      console.log('Department added!');
      runApp();
    });
  });
}

function addRole() {
  inquirer
  .prompt([
    {
    type: 'input',
    name: 'title',
    message: 'Enter the title of the new role:',
  },
  {
    type: 'number',
    name: 'salary',
    message: 'Enter the salary for the new role',
  },
  {
    type: 'number',
    name: 'department_id',
    message: 'Enter the department ID for the new role', 
  }
])
  .then((answers) => {
    const { title, salary, department_id } = answers;
    const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
    connection.query(query, [title, salary, department_id], (err, res) => {
      if (err) throw err;
      console.log('Role Added!');
      runApp();
    })
  })
}

function addEmployee() {
 inquirer
 .prompt([
  {
    type: 'input',
    name: 'first_name',
    message: 'Enter employee first name:',
  },
  {
    type: 'input',
    name: 'last_name',
    message: 'Enter employee last name:',
  },
  {
    type: 'number',
    name: 'role_id',
    message: 'Enter employee role ID:',
  },
  {
    type: 'number',
    name: 'manager_id',
    message: 'Enter manager ID:',
  }
 ])
 .then((answers) => {
  const { first_name, last_name, role_id, manager_id } = answers;
  const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
  connection.query(query, [first_name, last_name, role_id, manager_id || null], (err, res) => {
    if (err) throw err;
    console.log('Employee Added!');
    runApp();
  })
})
}

function updateEmployeeRole() {
  const employeeQuery = 'SELECT id, first_name, last_name FROM employees';
  connection.query(employeeQuery, (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    inquirer
    .prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select employee to update:',
        choices: employeeChoices,
      },
      {
        type: 'number',
        name: 'newRoleId',
        message: 'Enter employee new role ID:',
      },
    ])
    .then((answers) => {
      const { employeeId, newRoleId } = answers;
      const updateQuery = 'UPDATE employees SET role_id = ? WHERE id = ?';
      connection.query(updateQuery, [newRoleId, employeeId], (err, res) => {
        if (err) throw err;
        console.log('Employee role updated!');
        runApp();
      });
    })
  })
}

function exitApp() {
  connection.end();
}


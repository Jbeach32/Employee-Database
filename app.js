const inquirer = require('inquirer')
const mysql = require('mysql')
//const { executeQuery, closePool } = require('./db'); // Import your database functions

// Function to display main menu options
function mainMenu() {
  inquirer
    .prompt([
      {
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
          'Exit',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
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
        case 'Exit':
          closeApp();
          break;
      }
    });
}

// Implement the viewDepartments, viewRoles, viewEmployees, addDepartment, addRole,
// addEmployee, updateEmployeeRole, and closeApp functions here.
function viewDepartments() {
    const sql = 'SELECT * FROM departments';
  
    executeQuery(sql)
      .then((results) => {
        console.table(results); // Display the results in a formatted table
        mainMenu(); // Return to the main menu
      })
      .catch((error) => {
        console.error('Error viewing departments:', error);
        mainMenu(); // Return to the main menu even in case of an error
      });
  }
  




// Start the application by calling the mainMenu function
mainMenu();

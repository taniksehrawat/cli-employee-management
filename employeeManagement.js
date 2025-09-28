// employeeManagement.js

const readline = require('readline');

// Initialize the array to store employees
let employees = [];

// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to display menu options
function showMenu() {
    console.log('\n=== Employee Management System ===');
    console.log('1. Add Employee');
    console.log('2. List All Employees');
    console.log('3. Remove Employee by ID');
    console.log('4. Exit');
    rl.question('Select an option: ', handleMenu);
}

// Function to handle user input from menu
function handleMenu(option) {
    switch(option.trim()) {
        case '1':
            addEmployee();
            break;
        case '2':
            listEmployees();
            break;
        case '3':
            removeEmployee();
            break;
        case '4':
            console.log('Exiting...');
            rl.close();
            break;
        default:
            console.log('Invalid option. Try again.');
            showMenu();
    }
}

// Function to add a new employee
function addEmployee() {
    rl.question('Enter Employee ID: ', (id) => {
        if(employees.find(emp => emp.id === id.trim())) {
            console.log('Employee with this ID already exists!');
            showMenu();
        } else {
            rl.question('Enter Employee Name: ', (name) => {
                employees.push({ id: id.trim(), name: name.trim() });
                console.log(`Employee ${name.trim()} added successfully.`);
                showMenu();
            });
        }
    });
}

// Function to list all employees
function listEmployees() {
    if(employees.length === 0) {
        console.log('No employees found.');
    } else {
        console.log('\n--- Employee List ---');
        employees.forEach(emp => {
            console.log(`ID: ${emp.id}, Name: ${emp.name}`);
        });
    }
    showMenu();
}

// Function to remove employee by ID
function removeEmployee() {
    rl.question('Enter Employee ID to remove: ', (id) => {
        const index = employees.findIndex(emp => emp.id === id.trim());
        if(index !== -1) {
            const removed = employees.splice(index, 1);
            console.log(`Employee ${removed[0].name} removed successfully.`);
        } else {
            console.log('Employee not found!');
        }
        showMenu();
    });
}

// Start the application
showMenu();

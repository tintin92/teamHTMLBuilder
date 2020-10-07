const fs = require("fs");
const inquirer = require("inquirer");

//Employee template based on these below.
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const path = require("path");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
const idArray = [];

function mainMenu() {

    createManager();
}

mainMenu();

function createManager() {
    inquirer.prompt([
        {
            type: "input",
            name: "managerName",
            message: "What is your managers name?",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter a name"
            }

        },
        {

            type: "input",
            name: "managerId",
            message: "What is your manager's ID?",
            validate: answer => {
                //checking for a negative input by user
                if (parseInt(answer) >= 0) {
                    return true;
                }
                return "Please enter a number for your manager's ID."
            },
        },
        {
            type: "input",
            name: "managerEmail",
            message: "What's your manager's email address?",
            validate: answer => {
                // checking for empty input
                if (answer !== "") {
                    return true;
                }
                return "Enter a valid email";
            },

        },

        {
            type: "input",
            name: "managerOffice",
            message: "What is your manager's office number?",
            validate: answer => {
                //checking for negative input by user
                if (parseInt(answer) >= 0) {
                    return true;
                }
                return "Please enter a number for your manager's office.";
            },

        }]).then(answers => {
            const manager = new Manager(answers.managerName, answers.managerId, answers.managerEmail, answers.managerOffice);
            //add manager to list of employees
            teamMembers.push(manager);
            //used to validate if name has already been selected 
            idArray.push(answers.managerId);
            createTeam();
        })

}

function createTeam() {
    inquirer.prompt([{
        type: "list",
        name: "employeeType",
        message: "Which team member would you like to add?",
        choices: ["Engineer", "Intern", "I don't want to add any more team members"]

    }]).then(answers => {

            if (answers.employeeType === "Engineer") {
                createEngineer();
            }

            else if (answers.employeeType === "Intern") {
                createIntern();
            }
            
            else {
                const renderedHtml = render(teamMembers);
                fs.writeFile(outputPath, renderedHtml, function (err) {
                    if (err) throw err;
                    console.log("Team Assemble Complete!");
                })
            }
        })

}

function createEngineer() {
    console.log("Please describe your engineer");
    inquirer.prompt([{
        type: "input",
        name: "engineerName",
        message: "What is your engineer's name?",
        validate: answer => {
            if (answer !== "") {
                return true;
            }
            return ("Please enter a name")
        }
    },
    {
        type: "input",
        name: "engineerId",
        message: "What is your engineer's ID?",
        validate: answer => {

            if (idArray.includes(answer)) {
                return "ID already used";
            }
            // checking for negative input
            if (parseInt(answer) >= 0) {
                return true;
            }
            return "IDs must be positive numbers";
        }
    },

    {
        type: "input",
        name: "engineerEmail",
        message: "What is your engineer's Email address?",
    },
    {
        type: "input",
        name: "engineerGithub",
        message: "What is your engineer's username on Github?"

    }]).then(answers => {
        const engineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.engineerGithub);
        teamMembers.push(engineer);
        idArray.push(answers.engineerId);
        createTeam();
    })
}

function createIntern() {
    inquirer.prompt([

        {
            type: "input",
            name: "internName",
            message: "What's your intern's name?",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return ("Please enter a valid name")
            }
        },
        {
            type: "input",
            name: "internId",
            message: "What is your intern's ID number?",
            validate: answer => {
                if (parseInt(answer) >= 0) {
                    return true;
                }
                return "Please enter a number for a intern ID.";
            }
        },
        {
            type: "input",
            name: "internEmail",
            message: "What is your intern's email address?",
            validate: answer => {
                const pass = answer.match(
                    /\S+@\S+\.\S+/
                );
                if (pass) {
                    return true;
                }
                return "Please enter a valid email address.";
            }
        },
        {
            type: "input",
            name: "internSchool",
            message: "What school does your intern attend?",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return "Enter a valid school";
            }

    }]).then(answers => {
        const intern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.internSchool);
        teamMembers.push(intern);
        idArray.push(answer.internId)
        createTeam();
    })

}






// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

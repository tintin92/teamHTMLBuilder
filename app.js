const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
const idArray = [];

function mainMenu() {

    createManager();

    function createManager() {
        console.log("Please Build Your Team")
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
                    return "Please enter a number for your manager's office."
                }

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
            name: "employeeClass",
            message: "Which team member would you like to add?",
            choices: ["Engineer", "Intern", "I don't want to add any more team members"]

        }]).then(answers => {

            if (answers.employeeClass === "Engineer") {
                createEngineer();
            }

            else if (answers.employeeClass === "Intern") {
                createIntern();
            }
            else {
                const renderedHtml = render(teamMembers);
                fs.writeFile(outputPath, renderedHtml, function (err) {
                    if (err) throw err;
                    console.log("Team Assemble Complete!")
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
            validate: answers => {
                if (answers !== "") {
                    return true;
                }
                return ("Please enter a name")
            }
        },
        {
            type: "input",
            name: "engineerEmail",
            message: "What is your engineer's Email address?"
        },
        {
            type: "input",
            name: "engineerGithub",
            message: "What is your engineer's username on Github?"
        },
        ]).then(answer => {
            const engineer = new Engineer(answer.engineerName, answer.engineerID, answer.engineerEmail, answer.engineerGithub);
            teamMembers.push(engineer);
            idArray.push(answer.engineerID);
            nextTeamMember();
        })
    }

    function createIntern() {
        console.log("Please describe your intern");
        inquirer.prompt([{
            type: "input",
            name: "internName",
            message: "What's your intern's name?"
        },
        {
            type: "input",
            name: "internID",
            message: "what is your intern's ID number?",
            validate: async answer => {
                if (answer <= 0) {
                    return "Please enter a number for a intern ID.";
                }
                // return true
            }
        },
        {
            type: "input",
            name: "internEmail",
            message: "What is your intern's email address?"
        },
        {
            type: "input",
            name: "internSchool",
            message: "What school does your intern attend?"
        }
        ]).then(answer => {
            const intern = new Intern(answer.internName, answer.internID, answer.internEmail, answer.internSchool);
            teamMembers.push(intern);
            idArray.push(answer.internID);
            nextTeamMember();
        })
    }
    createManager()
}
mainMenu()
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

#!/usr/bin/env node
const inquirer = require('inquirer');
const Create = require('./scripts/create_structure');
(async () => { 
	try {
        const projectDetails = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: "What is the name of your project?",
            },
            {
                type: 'rawlist',
                name: 'readme',
                message: 'Do you want to create a readme.txt within directories for more information?',
                choices: [
                  'Yes',
                  'No'
                ]
              },
        ]);
        const shouldCreate = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'webConfig',
                message: 'Do you want to set up your web.configs now?',
                choices: [
                  'Yes',
                  'No'
                ]
            }
        ]);
        let webConfig = shouldCreate.webConfig === "Yes";
        let readme = projectDetails.readme === "Yes";
        if (webConfig) {
            var webConfigDetails = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'dataBaseNameDev',
                    message: `What is your database name for your development environment?`,
                },
                {
                    type: 'input',
                    name: 'dataBaseNameStage',
                    message: `What is your database name for your staging environment?`,
                },
                {
                    type: 'input',
                    name: 'dataBaseNameProd',
                    message: `What is your database name for your production environment?`,
                },
                {
                    type: 'input',
                    name: 'dataSourceDev',
                    message: `What is your database host name for your development database (AKA the server name)?`,
                },
                {
                    type: 'input',
                    name: 'dataSourceStage',
                    message: `What is your database host name for your staging database (AKA the server name)?`,
                },
                {
                    type: 'input',
                    name: 'dataSourceProd',
                    message: `What is your database host name for your production database (AKA the server name)?`,
                },
            ]);
        }
        let answers = webConfig ? 
            {
                ...webConfigDetails, 
                ...projectDetails, 
                //Creating a prop on this object called shouldCreate
                ...{ 
                    //For future toggles
                    shouldCreate: { 
                        webConfig,
                        readme 
                    } 
                }
            }
        : 
            { 
                ...projectDetails, 
                //Creating a prop on this object called shouldCreate
                ...{ 
                    //For future toggles
                    shouldCreate: { 
                        webConfig,
                        readme 
                    }
                } 
            }
        const create = new Create(answers);
        create.create_structure();
	}
	catch( e ) {
		//Catch anything bad that happens
        console.log(e);
	}
})();
const inquirer = require('inquirer');
const Create = require('./scripts/create_zip');
(async () => {
    const { zipName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'zipName',
            message: "What do you want to name the .zip file?",
        }
    ]);
    const creation = new Create({ zipName })
    creation.init();
    await creation.utils.addToZip();
    creation.create_zip();
})();
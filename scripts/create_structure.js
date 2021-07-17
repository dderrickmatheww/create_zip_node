const fs = require('fs');
const process = require("process");
const projectPath = __dirname;
const folder_structure = require('../utils/model');
const create_sln = require('./create_sln');
//Creates file structure based off the folder_structure function.
class Create {
    //Pass an obj into the new instance ( new Create(obj).create_structure(); ) based off the user input via terminal
    constructor(obj) {
        //Call the create_structure function to fire the creation process.
        this.create_structure = async () => {
            try {
                let dir = this.state.dirObj;
                let { content } = dir;
                await this.utils.createDir(dir);
                if (content) {
                    await this.utils.createContent(content);
                }
                process.chdir(projectPath);
            }
            catch (e) {
                console.log(e);
            }
        }
        this.utils = {
            //Create directory
            createDir: async (dir) => {
                let { name } = dir;
                if (!fs.existsSync(name)) {
                    fs.mkdirSync(name);
                    process.chdir(name);
                }
                else {
                    process.chdir(name);
                }
            },
            //Create files
            createFile: async (files) => {
                await files.forEach(async (file) => {
                    let { name, template, slnFile } = file;
                    if (slnFile) {
                        create_sln(slnFile);
                    }
                    else {
                        fs.writeFileSync(name, template ? template : "");
                    }
                });
            },
            //Create content within the directory
            createContent: async (content) => {
                for (let prop in content) {
                    let child = content[prop];
                    try {
                        if (!Array.isArray(child)) {
                            let { content } = child;
                            let hasChild = (content ? (Object.keys(content).length > 0 ? true : false) : false);
                            await this.utils.createDir(child);
                            if (hasChild) {
                                await this.utils.createContent(content);
                            }
                            process.chdir(`../`);
                        }
                        else {
                            let files = child;
                            if (files && files.length > 0) {
                                await this.utils.createFile(files);
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
        }
        //State that must be set in the new intance ( new Create(obj) ) before calling the create_structure
        this.state = {
            dirObj: folder_structure(obj)
        }
    }
    //Setter to set the state within the class
    set setState (obj) {
        for (let prop in obj) {
            this.state[prop] = obj[prop];
        }
    }
}
module.exports = Create;
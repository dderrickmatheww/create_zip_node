const fs = require('fs');
const process = require("process");
const JSZip = require("jszip");
const projectPath = process.cwd();

//Creates file structure based off the folder_structure function.
class Create {
    //Pass an obj into the new instance ( new Create(obj).create_structure(); ) based off the user input via terminal
    constructor(obj) {
        const { zipName } = obj; 
        //Call the create_structure function to fire the creation process.
        this.create_zip = async () => {
            process.chdir(projectPath);
            const zip = this.state.zip;
            const zipName = this.state.zipName;
            zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream(`${ zipName }.zip`))
            .on('finish', () => {
                console.log(`${ zipName }.zip written.`);
            });
        }
        this.utils = {
            addToZip: async (folder = null) => {
                try {
                    if (!folder) {
                        process.chdir(projectPath);
                    }
                    const dirs = fs.readdirSync(process.cwd());
                    const zip = this.state.zip;
                    if (dirs.length > 0) {
                        dirs.forEach((dir) => { 
                            if (fs.existsSync(dir)) {
                                if (fs.lstatSync(dir).isDirectory()) {
                                    process.chdir(dir);
                                    let folder = zip.folder(dir);
                                    this.utils.addToZip(folder);
                                }
                                else {
                                    let file = fs.readFileSync(`${ process.cwd() }/${ dir }`);
                                    if (folder) {
                                        folder.file(dir, file, { base64: true });
                                    }
                                    else {
                                        zip.file(dir, file);
                                    }
                                }
                            }
                        });
                        this.setState = {
                            zip: zip
                        };
                        this.create_zip();
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        //State that must be set in the new intance ( new Create(obj) ) before calling the create_structure
        this.state = {
            zip: new JSZip(),
            zipName: zipName
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
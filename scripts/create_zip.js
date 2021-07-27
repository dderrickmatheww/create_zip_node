const fs = require('fs');
const process = require("process");
const archiver = require('archiver');
const projectPath = process.cwd();

//Creates file structure based off the folder_structure function.
class Create {
    //Pass an obj into the new instance ( new Create(obj).create_structure(); ) based off the user input via terminal
    constructor(obj) {
        const { zipName } = obj;
        this.init = () => {
            const output = fs.createWriteStream(process.cwd() + `/../${ zipName }.zip`);
            this.setState = {
                archive: archiver('zip', {
                    zlib: { level: 9 } // Sets the compression level.
                })
            }
            const archive = this.getArchive;
            // listen for all archive data to be written
            // 'close' event is fired only when a file descriptor is involved
            output.on('close', () => {
                console.log(archive.pointer() + ' total bytes');
                console.log(`${ zipName }.zip has been finalized and the output file descriptor has closed.`);
            });
            // This event is fired when the data source is drained no matter what was the data source.
            // It is not part of this library but rather from the NodeJS Stream API.
            // @see: https://nodejs.org/api/stream.html#stream_event_end
            output.on('end', () => {
                console.log('Data has been drained');
            });
            // good practice to catch warnings (ie stat failures and other non-blocking errors)
            this.state.archive.on('warning', (err) => {
                if (err.code === 'ENOENT') {
                    console.log(err.code);
                } else {
                    // throw error
                    throw err;
                }
            });
            // good practice to catch this error explicitly
            archive.on('error', (err) => {
                throw err;
            });
            // pipe archive data to the file
            archive.pipe(output);
        }
        //Call the create_structure function to fire the creation process.
        this.create_zip = async () => {
            process.chdir(projectPath);
            this.state.archive.finalize();
        }
        this.utils = {
            addToZip: async () => {
                try {
                    const dirs = fs.readdirSync(process.cwd());
                    for (let i = 0; i < dirs.length; i++) {
                        let dir = dirs[i];
                        //Make sure hidden files are not looped through
                        if (this.state.noZip.includes(dir)) {
                            continue;
                        }
                        else {
                            if (fs.lstatSync(dir).isDirectory()) {
                                this.utils.addFolder(dir);
                            }
                            else {
                               this.utils.addFile(dir);
                            }
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            },
            addFile: async (dir) => {
                this.state.archive.file(`${ process.cwd() }/${ dir }`, { name: dir });
            },
            addFolder: (dir) => {
                // append files from a sub-directory and naming it `new-subdir` within the archive
                this.state.archive.directory(`${ process.cwd() }/${ dir }`, dir);
            }
        }
        //State that must be set in the new intance ( new Create(obj) ) before calling the create_structure
        this.state = {
            zipName: zipName,
            noZip: ['node_modules', '.git'],
            archive: null
        }
    }
    //Setter to set the state within the class
    set setState (obj) {
        for (let prop in obj) {
            this.state[prop] = obj[prop];
        }
    }
    get getArchive () {
        return this.state.archive;
    }
}
module.exports = Create;
import path from 'path';
import os from 'node:os';
import fs from 'node:fs';

let userHomeDir = os.homedir();

const list = (userHomeDir) => {
  try {
      fs.exists(userHomeDir, (e) => {
          if (e) {
              const files = fs.readdirSync(userHomeDir);
              const fileArr = [];
              const dirArr = [];
              for (const file of files) {
                if (file.includes('.')) {
                  fileArr.push(file);
                } else {
                  dirArr.push(file);
                }
              }

              const table = [];

              dirArr.forEach((item) => {
                table.push({Name: item, Type: 'directory'})
              });

              fileArr.forEach((item) => {
                table.push({Name: item, Type: 'file'})
              });

              console.table(table, ["Name", "Type"]); 
          } else {
              console.log('Operation failed');
          }
      }); 
    } catch (err) {
      console.log('Operation failed');
    }
};

const create = (userHomeDir) => {
  try {
      fs.exists(userHomeDir, (e) => {
          if (e) {
            console.log('Operation failed');
          } else {
            fs.writeFileSync(userHomeDir, '');
          }
      }); 
    } catch (err) {
      console.log('Operation failed');
    }
};

const rename = async (wrongNameFilePath, newNameFilePath) => {
  try {
      fs.exists(wrongNameFilePath, async (e) => {
          if (e) {
              fs.exists(newNameFilePath, async (e) => {
                  if (e) {
                      console.log('Operation failed');
                  } else {
                      fs.rename(wrongNameFilePath, newNameFilePath, (err) => {
                          if (err) {
                            console.error(err);
                          }
                        });
                  }
              }); 
          } else {
            console.log('Operation failed');
          }
      }); 
    } catch (err) {
      console.log('Operation failed');
    }
};

const remove = (dirPath) => {
  try {
      fs.exists(dirPath, (e) => {
          if (e) {
            fs.rmSync(dirPath, { recursive: true }, (err) => {
              console.log('Operation failed');
            });
          } else {
            console.log('Operation failed');
          }
      }); 
    } catch (err) {
      console.log('Operation failed');
    }
};

const initApp = () => {
  try {
    
    const indx = process.argv.findIndex((item) => {
      return item.includes('--username');
    });

    const userName = process.argv[indx].substring(11);

    console.log(`Welcome to the File Manager, ${userName}!`);
    console.log(`You are currently in ${userHomeDir}`);

    process.stdin.on('data', async (data) => { 
      const up = data.toString().includes('up');
      const cd = data.toString().includes('cd');
      const ls = data.toString().includes('ls');
      const cat = data.toString().includes('cat');
      const add = data.toString().includes('add');
      const rn = data.toString().includes('rn');
      const cp = data.toString().includes('cp');
      const mv = data.toString().includes('mv');

      if (!up && !cd && !ls && !cat && !add && !rn && !cp && !mv) {
        console.log('Invalid input')
      }

      if (up) {
        if (userHomeDir.split('/').length > 2) {
          userHomeDir = path.join(userHomeDir, '..');
        }
        console.log(`${userHomeDir}`)
      }

      if (cd) {
        userHomeDir = path.join(userHomeDir, `/${data.toString().substring(3).trim()}`);
        console.log(`${userHomeDir}`)
      }

      if (ls) {
        list(userHomeDir);
      }

      if (cat) {
        const readPath = path.join(`${data.toString().substring(4).trim()}`);
        const readable = fs.createReadStream(readPath);
        const read = () => {
          readable.on('data', (chunk) => {
              process.stdout.write(chunk);
          }); 
        };

        read();
      }

      if (add) {
        const writeDir = path.join(`${userHomeDir+'/'+data.toString().substring(4).trim()}`);
        create(writeDir);
      }

      if (rn) {
        const cliArr = data.toString().trim().split(' ');
        const dir = path.dirname(cliArr[1]);
        const wrongNameFilePath = path.join(`${cliArr[1]}`);
        const newNameFilePath = path.join(`${dir}/${cliArr[2]}`);
        console.log(wrongNameFilePath, newNameFilePath);
        rename(wrongNameFilePath, newNameFilePath);
      }

      if (cp) {
        const cliArr = data.toString().trim().split(' ');
        const fileName = path.basename(cliArr[1]);
        const folderFilePath = path.join(`${cliArr[1]}`);
        const newFolderFilePath = path.join(`${cliArr[2]}/${fileName}`);
        const writeableStream = fs.createWriteStream(newFolderFilePath);
        const readableStream = fs.createReadStream(folderFilePath);

        readableStream.on("data", (chunk) => { 
          writeableStream.write(chunk.toString());
        });
      }

      if (mv) {
        const cliArr = data.toString().trim().split(' ');
        const fileName = path.basename(cliArr[1]);
        const folderFilePath = path.join(`${cliArr[1]}`);
        const newFolderFilePath = path.join(`${cliArr[2]}/${fileName}`);
        const writeableStream = fs.createWriteStream(newFolderFilePath);
        const readableStream = fs.createReadStream(folderFilePath);

        readableStream.on("data", (chunk) => { 
          writeableStream.write(chunk.toString());
        });

        readableStream.close();
        
        remove(folderFilePath);
      }

      if (data.toString().includes('.exit')) {
        console.log('Thank you for using File Manager, Username, goodbye!');
        process.exit();
      }

      console.log(`You are currently in ${userHomeDir}`);
    });

    process.on('SIGINT', () => {
      console.log('Thank you for using File Manager, Username, goodbye!');
      process.exit();
    }); 
  } catch (err) {
    console.error(err);
  }
};

initApp();
import path from 'path';
import fs from 'node:fs';

const removeDefault = (dirPath, newDirPath) => {
    try {
        fs.exists(dirPath, (e) => {
            if (e) {
              fs.unlink(dirPath, (err) => {
                if (err) {
                  console.log('Operation failed');
                }
              })
              console.log(`You are currently in ${newDirPath ? path.dirname(newDirPath) : path.dirname(dirPath)}`);
            } else {
              console.log('Operation failed');
            }
        }); 
      } catch (err) {
        console.log('Operation failed');
      }
}

export const read = (data) => {
  const readPath = path.join(`${data.toString().substring(4).trim()}`);
  const readable = fs.createReadStream(readPath);
  readable.on('data', (chunk) => {
      process.stdout.write(chunk);
  }); 
  readable.on('end', () => {
    console.log(`\nYou are currently in ${path.dirname(readPath)}`);
  });
}

export const create = (userHomeDir, data) => {
    try { 
        const dir = path.join(`${userHomeDir+'/'+data.toString().substring(4).trim()}`);
        fs.exists(dir, (e) => {
            if (e) {
              console.log('Operation failed');
            } else {
              const writeableStream = fs.createWriteStream(dir);
              writeableStream.write('');
              console.log(`You are currently in ${path.dirname(dir)}`);
            }
        }); 
      } catch (err) {
        console.log('Operation failed');
      }
  };

  export const rename = async (data) => {
    try {
        const cliArr = data.toString().trim().split(' ');
        const dir = path.dirname(cliArr[1]);
        const wrongNameFilePath = path.join(`${cliArr[1]}`);
        const newNameFilePath = path.join(`${dir}/${cliArr[2]}`);
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
                            console.log(`You are currently in ${path.dirname(newNameFilePath)}`);
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

export const copy = (data) => {
  const cliArr = data.toString().trim().split(' ');
  const fileName = path.basename(cliArr[1]);
  const folderFilePath = path.join(`${cliArr[1]}`);
  const newFolderFilePath = path.join(`${cliArr[2]}/${fileName}`);
  const writeableStream = fs.createWriteStream(newFolderFilePath);
  const readableStream = fs.createReadStream(folderFilePath);

  readableStream.on("data", (chunk) => { 
    writeableStream.write(chunk.toString());
  });

  readableStream.on('end', () => {
    console.log(`You are currently in ${path.dirname(newFolderFilePath)}`);
  });
}

export const move = (data) => {
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
        
        removeDefault(folderFilePath, newFolderFilePath);
}

export const remove = (data) => {
  const delFilePath = path.join(data.toString().substring(3).trim());
  removeDefault(delFilePath);
}
import path from 'path';
import os from 'node:os';
import fs from 'node:fs';
import stream from 'stream';
import crypto from 'crypto';
import zlib from 'node:zlib';
import { readdir } from 'node:fs/promises';

let userHomeDir = os.homedir();

const list = (userHomeDir) => {
  try {
      fs.exists(userHomeDir, async (e) => {
          if (e) {
              const files = await readdir(userHomeDir);
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
              console.log(`You are currently in ${userHomeDir}`);
          } else {
              console.log('Operation failed');
          }
      }); 
    } catch (err) {
      console.log('Operation failed');
    }
};

const create = (dir) => {
  try {
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

const remove = (dirPath, newDirPath) => {
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
};

const calculateHash = async (file, dirPath) => {
  let hash;
  await stream.promises.pipeline(
      file,
      crypto.createHash('sha256').setEncoding('hex'),
      async (source) => {
          hash = (await source.toArray())[0];
      }
  );
  console.log(hash);
  console.log(`You are currently in ${path.dirname(dirPath)}`);
};

const compress = async (readFilePath, compressFilePath) => {
  const readFileName = path.basename(readFilePath);
  const readStream = fs.createReadStream(readFilePath);
  const writeStream = fs.createWriteStream(`${compressFilePath}/${readFileName}.br`);
  
  const brotli = zlib.createBrotliCompress();
  
  const stream = await readStream.pipe(brotli).pipe(writeStream);
  
  stream.on('finish', () => {
    console.log('Compress is done');
    console.log(`You are currently in ${compressFilePath}`);
  });
}

const decompress = async (readFilePath, decompressFilePath) => {
  const readFileName = path.basename(readFilePath);
  const fileNameWithoutExt = path.basename(readFileName, path.extname(readFileName));

  const readStream = fs.createReadStream(readFilePath);
  const writeStream = fs.createWriteStream(`${decompressFilePath}/${fileNameWithoutExt}`);

  const brotli = zlib.createBrotliDecompress();

  const stream = await readStream.pipe(brotli).pipe(writeStream);

  stream.on('finish', () => {
    console.log('Decompress is done');
    console.log(`You are currently in ${decompressFilePath}`);
  });
}

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
      const rn = data.toString().includes('rn') && !data.toString().includes('username');
      const cp = data.toString().includes('cp') && !data.toString().includes('cpus');
      const mv = data.toString().includes('mv');
      const rm = data.toString().includes('rm');
      const osComm = data.toString().includes('os');
      const hash = data.toString().includes('hash');
      const cmps = data.toString().includes('compress') && !data.toString().includes('decompress');
      const dcmps = data.toString().includes('decompress');

      if (!up && !cd && !ls && !cat && !add && !rn && !cp && !mv && !rm && !osComm && !hash && !cmps && !dcmps) {
        console.log('Invalid input');
      }

      if (up) {
        if (userHomeDir.split('/').length > 2) {
          userHomeDir = path.join(userHomeDir, '..');
        }
        console.log(`${userHomeDir}`);
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
        readable.on('data', (chunk) => {
            process.stdout.write(chunk);
        }); 
        readable.on('end', () => {
          console.log(`\nYou are currently in ${path.dirname(readPath)}`);
        });
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

        readableStream.on('end', () => {
          console.log(`You are currently in ${path.dirname(newFolderFilePath)}`);
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
        
        remove(folderFilePath, newFolderFilePath);
      }

      if (rm) {
        const delFilePath = path.join(data.toString().substring(3).trim());
        remove(delFilePath);
      }

      if (osComm) {
        if (data.toString().includes('EOL')) {
          const EOL = os.EOL;
          console.log(`EOL: ${JSON.stringify(EOL)}`);
        }
        
        if (data.toString().includes('cpus')) {
          console.log(`Overall amount of CPUS: ${os.cpus().length}`);
          console.log(os.cpus());
        }
  
        if(data.toString().includes('homedir')) {
          console.log(os.homedir());
        }

        if (data.toString().includes('username')) {
          console.log(process.env.USER);
        }

        if (data.toString().includes('architecture')) {
          console.log(process.arch);
        }  
      }

      if (hash) {
        const dirPath = data.toString().trim().substring(5);
        const file = fs.createReadStream(dirPath);
        await calculateHash(file, dirPath);
      }

      if (cmps) {
        const cliArr = data.toString().trim().split(' ');
        compress(cliArr[1], cliArr[2]);
      }

      if (dcmps) {
        const cliArr = data.toString().trim().split(' ');
        decompress(cliArr[1], cliArr[2]);
      }
      
      if (data.toString().includes('.exit')) {
        console.log('Thank you for using File Manager, Username, goodbye!');
        process.exit();
      }

      if(up || cd || osComm) {
        console.log(`You are currently in ${userHomeDir}`);
      }
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
import path from 'path';
import os from 'node:os';
import fs from 'node:fs';

let userHomeDir = os.homedir();

const list = () => {
  try {
      fs.exists('/Users/Alesun4ik', (e) => {
          if (e) {
              const files = fs.readdirSync('/Users/Alesun4ik');
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
      console.error(err);
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

    process.stdin.on('data', (data) => { 
      const up = data.toString().includes('up');
      const cd = data.toString().includes('cd');
      const ls = data.toString().includes('ls');

      if (!up && !cd && !ls) {
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
        list();

        // fs.readdir(userHomeDir, (e) => {
        //   console.log(e)
        // });
        // fs.exists('C:/Users/Alesun4ik', async (e) => {
        //   if (e) {
        //       const files = await fs.readdir(userHomeDir);
        //       const fileArr = [];
        //       for (const file of files) {
        //         fileArr.push(file);
        //       }
        //       console.log(fileArr);
        //   } else {
        //       console.log('Operation failed');
        //   }
        // }); 
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
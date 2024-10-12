import path from 'path';
import os from 'node:os';

const initApp = () => {
  try {
    let userHomeDir = os.homedir();

    const indx = process.argv.findIndex((item) => {
      return item.includes('--username');
    });

    const userName = process.argv[indx].substring(11);

    console.log(`Welcome to the File Manager, ${userName}!`);
    console.log(`You are currently in ${userHomeDir}`);

    process.stdin.on('data', (data) => { 
      const up = data.toString().includes('up');
      const cd = data.toString().includes('cd');

      if (!up && !cd) {
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
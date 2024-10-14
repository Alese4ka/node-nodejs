import os from 'node:os';
import { read, create, rename, copy, move, remove } from './components/file-operations.js';
import { operationsWithOs } from './components/os-operations.js';
import { calculateHash } from './components/hash-operation.js';
import { compress, decompress } from './components/compress-decompress-operations.js';
import { upDir, cdDir, listDir } from './components/nav-operations.js';
import { general } from './components/general-operations.js';
import { handlingCommand } from './components/handling-command.js';

let userHomeDir = os.homedir();

const initApp = () => {
  try {
    general(userHomeDir);

    process.stdin.on('data', async (data) => { 
      if (handlingCommand(data) === 'up') {
        upDir(userHomeDir);
      } else if (handlingCommand(data) === 'cd') {
        cdDir(userHomeDir, data);
      } else if (handlingCommand(data) === 'ls') {
        listDir(userHomeDir);
      } else if (handlingCommand(data) === 'cat') {
        read(data);
      } else if (handlingCommand(data) === 'add') {
        create(userHomeDir, data);
      } else if (handlingCommand(data) === 'rn') {
        rename(data);
      } else if (handlingCommand(data) === 'cp') {
        copy(data);
      } else if (handlingCommand(data) === 'mv') {
        move(data);
      } else if (handlingCommand(data) === 'rm') {
        remove(data);
      } else if (handlingCommand(data) === 'osComm') {
        operationsWithOs(userHomeDir, data);
      } else if (handlingCommand(data) === 'hash') {
        calculateHash(data);
      } else if (handlingCommand(data) === 'cmps') {
        compress(data);
      } else if (handlingCommand(data) === 'dcmps') {
        decompress(data);
      } else if (handlingCommand(data) === 'exit') {
        console.log('Thank you for using File Manager, Username, goodbye!');
        process.exit();
      } else {
        console.log('Invalid input');
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
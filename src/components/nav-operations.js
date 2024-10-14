import fs from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'path';

export const upDir = (userHomeDir) => {
  if (userHomeDir.split('/').length > 2) {
    userHomeDir = path.join(userHomeDir, '..');
  }
  console.log(`${userHomeDir}`);
  console.log(`You are currently in ${userHomeDir}`);
}

export const cdDir = (userHomeDir, data) => {
  userHomeDir = path.join(userHomeDir, `/${data.toString().substring(3).trim()}`);
  console.log(`${userHomeDir}`);
  console.log(`You are currently in ${userHomeDir}`);
}

export const listDir = (userHomeDir) => {
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
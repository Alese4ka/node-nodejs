import os from 'node:os';

export const operationsWithOs = (userHomeDir, data) => {
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
  console.log(`You are currently in ${userHomeDir}`);
}
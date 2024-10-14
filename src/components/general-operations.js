export const general = (userHomeDir) => {
  const indx = process.argv.findIndex((item) => {
    return item.includes('--username');
  });
  const userName = process.argv[indx].substring(11);

  console.log(`Welcome to the File Manager, ${userName}!`);
  console.log(`You are currently in ${userHomeDir}`);
}
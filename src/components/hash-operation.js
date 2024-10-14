import stream from 'stream';
import crypto from 'crypto';
import fs from 'node:fs';
import path from 'path';

export const calculateHash = async (data) => {
  const dirPath = data.toString().trim().substring(5);
  const file = fs.createReadStream(dirPath);
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
import zlib from 'node:zlib';
import path from 'path';
import fs from 'node:fs';

export const compress = async (data) => {
  const cliArr = data.toString().trim().split(' ');
  const readFilePath = cliArr[1];
  const compressFilePath = cliArr[2];

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

export const decompress = async (data) => {
  const cliArr = data.toString().trim().split(' ');
  const readFilePath = cliArr[1];
  const decompressFilePath = cliArr[2];
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
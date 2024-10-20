import http from 'http';
import url from 'url';
import fs from 'node:fs';
import cluster from 'cluster';
import os from 'node:os';
import querystring from 'querystring';
import { readFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { validate as isValidUUID } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUser } from './utils/get-user.ts';
import { User } from './utils/interfaces.ts';

const port = process.env.PORT; 
const dataPath = path.join('./src/data.json'); 

const uuid = uuidv4();

const data = fs.readFileSync('./src/data.json', 'utf-8');
let users: User[] = JSON.parse(data);

export const server = http.createServer((req, res) => {
    try {
      if(req.url) {
        const urlparse = url.parse(req.url, true);
        const userId = urlparse.pathname!.split('/').pop();
  
        if(urlparse.pathname === '/api/users' && req.method === 'GET') {
          res.writeHead(200, {'Content-Type': 'application/json'}); 
          res.end(JSON.stringify(users, null, 2));
        }
  
        if(urlparse.pathname?.includes('/api/users/') && req.method === 'GET' && userId) {
          if (userId && isValidUUID(userId)) {
            if (users.find((user: {id: string}) => user.id === userId)) {
              res.writeHead(200, {'Content-Type': 'application/json'}); 
              res.end(JSON.stringify(users.find((user: {id: string}) => user.id === userId), null, 2));
            } else {
              res.writeHead(404, {'Content-Type': 'application/json'}); 
              res.end("User's doesn't exist");
            }
          } else {
            res.writeHead(400, {'Content-Type': 'application/json'}); 
            res.end("User's id is invalid");
          }
        }
  
        if (urlparse.pathname === '/api/users' && req.method === 'POST'){
          let body = '';
  
          req.on('data', chunk => {
            body += chunk.toString();
          });
          
            req.on('end', () => {
              const parseBody = JSON.parse(body);
              if(parseBody.username && parseBody.age && parseBody.hobbies) {
                const newUser = {
                  id: uuid,
                  ...parseBody
                };
      
                users.push(newUser);
      
                const writableStream = fs.createWriteStream(dataPath);
                writableStream.write(JSON.stringify(users, null, 2));
                if (!res.headersSent) {
                  res.writeHead(201, {'Content-Type': 'application/json'}); 
                  res.end('User was created');
                }
              } else {
                if (!res.headersSent) {
                  res.writeHead(400, {'Content-Type': 'application/json'}); 
                  res.end('Request body does not contain required fields');
                }
              }
            });
        }
  
        if (urlparse.pathname?.includes('/api/users/') && userId && req.method === 'PUT') {
          let body = '';
  
          req.on('data', chunk => {
            body += chunk.toString();
          });
          
          req.on('end', () => {
            const parseBody = JSON.parse(body);
              const response = getUser(userId, users);
  
              if (typeof response === 'string') {
                res.writeHead(400, {'Content-Type': 'application/json'}); 
                res.end(response);
              } else if (!response) {
                res.writeHead(404, {'Content-Type': 'application/json'}); 
                res.end("User's doesn't exist");
              } else {
                const newUser = {
                  ...response,
                  ...parseBody
                };
        
                users = users.filter((user) => user.id !== userId);
                users.push(newUser);
        
                const writableStream = fs.createWriteStream(dataPath);
                writableStream.write(JSON.stringify(users, null, 2));
                res.writeHead(200, {'Content-Type': 'application/json'}); 
                res.end('User was updated');
                }
          });
        }
  
        if(urlparse.pathname?.includes('/api/users/') && userId && req.method === 'DELETE') {
            const response = getUser(userId, users);
  
            if (typeof response === 'string') {
              res.writeHead(400, {'Content-Type': 'application/json'}); 
              res.end(response);
            } else if (!response) {
              res.writeHead(404, {'Content-Type': 'application/json'}); 
              res.end("User's doesn't exist");
            } else {
              users = users.filter((user) => user.id !== userId);
              const writableStream = fs.createWriteStream(dataPath);
              writableStream.write(JSON.stringify(users, null, 2));
              res.writeHead(204, {'Content-Type': 'application/json'}); 
              res.end('User was deleted');
            }
        }
  
        if(!urlparse.pathname?.includes('/api/users/')) {
          res.writeHead(404, {'Content-Type': 'application/json'}); 
          res.end("Information doesn't found. Please check your request");
        }
      }
    } catch {
      if (!res.headersSent) {
        res.writeHead(500, {'Content-Type': 'application/json'}); 
        res.end("Sorry. Server is unreachable. Try later.");
      }
    }
  });

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master process is running on PID: ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();  
  });
} else {
  if(port && cluster.worker) {
    const unicPort = port + cluster.worker.id; 
    server.listen(unicPort);
  }
  console.log(`Worker process is running on PID: ${process.pid}`);
}
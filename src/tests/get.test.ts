import http from 'http';
import { server } from '../index';
import url from 'url';

describe('Test API', () => {
  let testServer: http.Server;

  beforeAll((done) => {
   testServer = server.listen(4100, () => {
      done();
    });
  });

  afterAll((done) => {
    testServer.close(() => {
      done();
    });
  });

  test('GET /api/users should return empty array', (done) => {
    http.get('http://localhost:4100/api/users', (res) => {
      let data = '';

      res.on('data', chunk => {
          data += chunk;
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(data)).toEqual([]);
        done();
      });
    });
  });


  // test('POST /api/users return request data', (done) => {
  //   const postData = JSON.stringify({
  //     username: 'John',
  //     age: 25,
  //     hobbies: []
  //   });

  //   const options = {
  //     hostname: 'localhost',
  //     port: 4100,
  //     path: '/api/users',
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //   };

  //   const req = http.request(options, (res) => {
  //     let data = '';

  //     res.on('data', chunk => {
  //       data += chunk;
  //     });

  //     res.on('end', () => {
  //       console.log(data)
  //       expect(res.statusCode).toBe(201);
  //       expect(JSON.parse(data)).toEqual({
  //         username: 'John',
  //         age: 25,
  //         hobbies: []
  //       });
  //       done();
  //     });
  //   });

  //   req.write(postData);
  //   req.end();
  // });

  // test('GET /api/users should return user', (done) => {
  //   const userId = 'ccba4935-e9eb-4296-84ae-29c2f02d20eb';
    
  //   http.get(`http://localhost:4100/api/users/${userId}`, (res) => {
  //     let data = '';

  //     res.on('data', (chunk) => {
  //       data += chunk;
  //     });

  //     res.on('end', () => {
  //       expect(res.statusCode).toBe(200);
  //       const expectedUser = {
  //         id: userId,
  //         username: 'John',
  //         age: 25,
  //         hobbies: []
  //       };
  //       expect(JSON.parse(data)).toEqual([expectedUser]);
  //       done();
  //     });
  //   })
  // });
});

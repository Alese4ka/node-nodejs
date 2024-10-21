# node-nodejs-file-system
Here’s a sample `README.md` for your application that includes the necessary instructions for running the app in development and production modes, as well as how to use the GET, POST, PUT, and DELETE requests.

```markdown
# CRUD API

## Overview

This application is a simple API for managing users. You can perform CRUD (Create, Read, Update, Delete) operations on user data. 

## Getting Started

### Prerequisites

- Node.js (version 22.9.0)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

### Running the Application

#### Development Mode

To run the application in development mode, use the following command:

```bash
npm run start:dev
```

#### Production Mode

To run the application in production mode, use the following command:

```bash
npm run start:prod
```

### Using the API

#### GET Requests

To make GET requests, open your browser and navigate to:

- To get all users: 
  ```
  http://localhost:4000/api/users
  ```
- To get a specific user by ID (replace `e633ec27-1422-43cb-8fa6-6f8c0c4dbb98` with the actual user ID):
  ```
  http://localhost:4000/api/users/e633ec27-1422-43cb-8fa6-6f8c0c4dbb98
  ```

#### POST, PUT, DELETE Requests

For POST, PUT, and DELETE requests, you will need to use the browser's console. You can execute the following fetch commands:

##### POST Request

To create a new user:

```javascript
fetch('http://localhost:4000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'John',
    age: 25,
    hobbies: []
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

##### PUT Request

To update an existing user (replace `e633ec27-1422-43cb-8fa6-6f8c0c4dbb98` with the actual user ID):

```javascript
fetch('http://localhost:4000/api/users/e633ec27-1422-43cb-8fa6-6f8c0c4dbb98', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'Den',
    age: 29
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

##### DELETE Request

To delete a user (replace `e633ec27-1422-43cb-8fa6-6f8c0c4dbb98` with the actual user ID):

```javascript
fetch('http://localhost:4000/api/users/e633ec27-1422-43cb-8fa6-6f8c0c4dbb98', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Running Tests

To run the tests, use the following command:

```bash
npm run test
```
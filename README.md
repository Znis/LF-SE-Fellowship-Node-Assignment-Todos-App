# Todo App

Todo App is an application that lets you add your todos and keep track of them.  
The repository contains following branches:  
- __assignment-1__  
It contains the API or node server that handles the CRUD operation of the Todo app, fulfilling basic requirements of the assignment 1.     
It has no active database. Instead, it uses a local variable containing few todos item.  
The image is available at the Dockerhub. It can be build with the following tag 'znis/todoapp:latest'.   

- __assignment-2__  
It extends the feature of assignment-1 with authentication system, JWT tokens and database.    
The app can be run on docker with docker-compose command. 

- __assignment-3__  
It extends the feature of assignment-2 with HTTP Status codes, Custom Error, Authorization with roles and permissions and logger.   
The app can be run on docker with docker-compose command.  

- __assignment-4__  
It extends the feature of assignment-3 with Input Schema Validation.  

- __assignment-5__  
It extend the assignment-4 branch with unit testing and integration testing.   

- __assignment-6__   
The assignment-6 is tasked with initialising database and creating migration and seeder files. The database initialisation, connection, migration and seeder files creation have already been done in earlier assignment branch.  

- __assignment-7__   
It extend the assignment-7 with improved way of database connection and executing queries, size and pagination for getTodos query, adds types for query result.    

  Following are the usage routes for the API: 
   - Todos
       
     POST /todos/ -> fetch all the todos. (query params like size and page can be provided. Default is size as 10 and page as 1)
  
     POST /todos/create -> Create the new todo. (requires body as Todo) 
 
     PUT /todos/update/ -> Update the existing todo. (requires id param as Todo id and body as Todo)
  
     DELETE /todos/delete/ -> Delete the existing todo. (requires id param as Todo id)
 

   - Users (Only for ADMIN role) 
     
     POST /users/ -> fetch the user with email.  

     POST /users/register-> Create the new user. (requires body as User) 
  
     PUT /users/edit/ -> Update the existing user. (requires id param as user id abd body as User)
 
     DELETE /users/delete/ -> Delete the existing user. (requires id param as user id) 


   - Auth
       
     POST /auth/login -> Login with email and password and get the tokens. (requires body as login creds) 
  
     POST /auth/refresh-> Create the new access token with refresh token. (requires refresh token in auth headers)

  After initializing the API, the database is seeded with a few data in Users table (admin account) and in roles_permissions table with roles (admin and user) and their respective permissions. Check the seeder file in database/seeds directory. The default admin account credentials are:  

       email: admin@admin.com  
       password: Admin$
 


  The app can be run on docker with docker-compose command. 
Clone the repo and switch to branch assignment-7 and run the command.    
Create a .env file and specify the necessary args as given in .env.example.
  
  Run the following commands.
   ```bash
  docker-compose up
  ```

  Unit testing can be performed by the following command.  
  ```bash
  npm test
  ```

  Integration testing can be performed by the following command.  
  ```bash
  npm run test:integration
  ```  

- __backend__  
It contains the API or node server that handles the CRUD operation of the Todo app as well as user authentication too with JWT tokens.  
It contains an active remote database. The database is PostgreSQL database provided by free database service provider ElephantSQL.  
The API is hosted in free hosting platform Render.  
The API endpoint is
[API endpoint](https://lf-se-fellowship-node-assignment-todos.onrender.com).

- __frontend__  
It is the simple frontend for the Todo App.  
It is connected to the backend hosted at the Render.  
It shows Todos and authenticates the user.  
It is hosted in the Github Pages [here](https://znis.github.io/LF-SE-Fellowship-Node-Assignment-Todos-App/).  
For the authentication, use the dummy credentials.  
Email: dummy@dummy.com   
Password: dummy1234


- __gh-pages__
It hosts the frontend branch in Github Pages.


## Usage
Clone the repository.  
Create a .env file and specify the necessary args as given in .env.example.  
Run the following commands. Make sure the postgresql db is running.
```bash
npm install
npm run migrate
npm run seed
npm start
```
OR,  

Clone the repo and switch to branch assignment-7 and run the command.    
Create a .env file and specify the necessary args as given in .env.example.
  
Run the following commands.
```bash
docker-compose up
```


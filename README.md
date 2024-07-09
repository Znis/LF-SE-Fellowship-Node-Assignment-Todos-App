# Todo App

Todo App is an application that lets you add your todos and keep track of them.  
The repository contains following branches:  
- main  
It contains the API or node server that handles the CRUD operation of the Todo app, fulfilling basic requirements of the assignment.    
GET /todos/ -> fetch all the todos.  
POST /todos/ -> Create the new todo.  
PUT /todos/:id -> Update the existing todo.  
DELETE /todos/:id -> Delete the exisiting todo.  
It has no active database. Instead, it uses a local variable containing few todos item.  
The image is available at the Dockerhub. It can be build with the following tag 'znis/todoapp:latest'.    

- backend  
It contains the API or node server that handles the CRUD operation of the Todo app as well as user authentication too.  
It contains an active remote database. The database is PostgreSQL database provided by free database service provider ElephantSQL.  
The API is hosted in free hosting platform Render.  
The API endpoint is
[API endpoint](https://lf-se-fellowship-node-assignment-todos.onrender.com).

- frontend  
It is the simple frontend for the Todo App.  
It is connected to the backend hosted at the Render.  
It shows Todos and authenticates the user.  
It is hosted in the Github Pages [here](https://znis.github.io/LF-SE-Fellowship-Node-Assignment-Todos-App/).  
For the authentication, use the dummy credentials.  
Email: dummy@dummy.com   
Password: dummy1234


- gh-pages
It hosts the frontend branch in Github Pages.


## Usage
Clone the repository.  
Create a .env file and specify the necessary args as given in .env.example.  
Run the following commands.
```bash
npm install
npm start
```


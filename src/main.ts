import { stateVariables } from './stateVariable';
import './style.css';

interface Todo {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string; // Use Date if you prefer
  priority: 'High' | 'Medium' | 'Low';
  category: string;
}




var credentials = "";


document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm") as HTMLFormElement;
  const loginMessage = document.getElementById(
    "loginMessage"
  ) as HTMLParagraphElement;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      const response = await fetch(`${stateVariables.url}/${stateVariables.login}`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        loginMessage.innerText = "Network response was not ok";
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log(responseData); // Handle success response
      loginMessage.innerText = responseData;
      document.getElementById("login-container")!.style.display = "none";
      document.getElementById("main-container")!.style.display = "flex";
      credentials = btoa(`${email}:${password}`)
      fetchAndDisplayTodos();

        
    } catch (error) {
      console.error("Error Logging In:", error); // Handle error
      loginMessage.innerText = "Invalid Credentials";
    }
  });

  document.getElementById('registerButton')!.addEventListener('click', async function() {

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      const response = await fetch(`${stateVariables.url}/${stateVariables.register}`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        loginMessage.innerText = "Network response was not ok";
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log(responseData); // Handle success response
      loginMessage.innerText = responseData;
      document.getElementById("login-container")!.style.display = "none";
      document.getElementById("main-container")!.style.display = "flex";
      credentials = btoa(`${email}:${password}`)
      fetchAndDisplayTodos();
    } catch (error) {
      console.error("Error Registering:", error); // Handle error
      loginMessage.innerText = "User Already Exists";
    }
});
});



















var todosData: Todo[] = [];
var editingTodo: string | null = null;
const url = `${stateVariables.url}/${stateVariables.todos}`;



document.getElementById("logout")!.addEventListener("click", () => {
  sessionStorage.removeItem('creds');
  sessionStorage.setItem('authenticated', 'false');
  document.getElementById("login-container")!.style.display = "block";
  document.getElementById("main-container")!.style.display = "none";

});

async function fetchAndDisplayTodos() {
  try {
    const response = await fetch(url, {
      method: 'POST',   
      headers: {
        'Authorization': `Basic ${credentials}`
    },
  });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    todosData = await response.json();
    displayTodos();
  } catch(error) {
    console.error(error);
  }
}


 function displayTodos(): void{

  const todosList = document.getElementById('todosList') as HTMLElement;
  todosList.innerHTML = '';
  todosData.forEach((todo) => {
      const todoItem = document.createElement('div');
      todoItem.className = 'todo-item';

      const todoContent = document.createElement('div');
      todoContent.innerHTML = `
          <strong>${todo.title}</strong> - ${todo.description} - ${todo.dueDate} - ${todo.priority} - ${todo.category}
      `;

      const buttons = document.createElement('div');

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.onclick = () => deleteTodo(todo.id!);

      const editButton = document.createElement('button');
      editButton.innerText = 'Edit';
      editButton.onclick = () => editTodo(todo.id!);

      buttons.appendChild(editButton);
      buttons.appendChild(deleteButton);

      todoItem.appendChild(todoContent);
      todoItem.appendChild(buttons);
      todosList.appendChild(todoItem);
  });
}

async function addOrEditTodo() {
  const title = (document.getElementById('title') as HTMLInputElement).value;
  const description = (document.getElementById('description') as HTMLInputElement).value;
  const dueDate = (document.getElementById('dueDate') as HTMLInputElement).value;
  const priority = (document.getElementById('priority') as HTMLSelectElement).value as 'High' | 'Medium' | 'Low';
  const category = (document.getElementById('category') as HTMLInputElement).value;

  if (title && description && dueDate && priority && category) {
      const newTodo: Todo = {
          title,
          description,
          completed: false,
          dueDate,
          priority,
          category
      };
      
      if(editingTodo){

        try {
          const response = await fetch(`${url}/${stateVariables.update}/${editingTodo}`, {
              method: 'PUT',
              body: JSON.stringify(newTodo),
              headers: {
                  'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`

              }
          });
      
          if (!response.ok) {
              throw new Error('Failed to update todo');
          }
      
          const responseData = await response.json();
          console.log(responseData); // Handle success response
          (document.getElementById('add-todo') as HTMLInputElement).innerHTML = "Add Todo";
          fetchAndDisplayTodos();
          clearForm();
          
      
      
      } catch (error) {
          console.error('Error updating todo:', error); // Handle error
      }
      editingTodo = null;
      }
      else{
        try {
          const response = await fetch(`${url}/${stateVariables.create}`, {
              method: 'POST',
              body: JSON.stringify(newTodo),
              headers: {
                  'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`

              }
          });
  
          if (!response.ok) {
              throw new Error('Failed to add todo');
          }
  
          const responseData = await response.json();
          console.log(responseData);
          fetchAndDisplayTodos();
          clearForm();
  
      } catch (error) {
          console.error('Error adding todo:', error);
      }
      }


      
      
  } else {
      alert('Please fill in all fields');
  }
}

async function deleteTodo(id: string) {
  try {
    const response = await fetch(`${url}/${stateVariables.del}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credentials}`
      },
    });

    if (!response.ok) {
        throw new Error('Failed to Delete todo');
    }

    const responseData = await response.json();
    console.log(responseData); // Handle success response
    fetchAndDisplayTodos();

} catch (error) {
    console.error('Error deleteing todo:', error); // Handle error
}
  
}

async function editTodo(id: string) {
  const todo = todosData.find(({id: todoId}) => todoId == id)!;

  (document.getElementById('title') as HTMLInputElement).value = todo.title;
  (document.getElementById('description') as HTMLInputElement).value = todo.description;
  (document.getElementById('dueDate') as HTMLInputElement).value = todo.dueDate;
  (document.getElementById('priority') as HTMLSelectElement).value = todo.priority;
  (document.getElementById('category') as HTMLInputElement).value = todo.category;
  (document.getElementById('add-todo') as HTMLInputElement).innerHTML = "Edit Todo";
  editingTodo = id;


}

function clearForm(): void {
  (document.getElementById('title') as HTMLInputElement).value = '';
  (document.getElementById('description') as HTMLInputElement).value = '';
  (document.getElementById('dueDate') as HTMLInputElement).value = '';
  (document.getElementById('priority') as HTMLSelectElement).value = 'High';
  (document.getElementById('category') as HTMLInputElement).value = '';
}

if(credentials){
fetchAndDisplayTodos();
}

const addTodoBtn = document.getElementById("add-todo") as HTMLElement;
addTodoBtn.addEventListener("click", () => {
  addOrEditTodo();


});



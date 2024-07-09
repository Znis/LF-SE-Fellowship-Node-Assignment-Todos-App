import Cookies from "cookies-ts";
import { stateVariables } from "./stateVariable";
import "./style.css";
import {
  createData,
  deleteData,
  fetchData,
  makeApiCall,
  updateData,
} from "./apiCallFunction";

export interface Todo {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string; // Use Date if you prefer
  priority: "High" | "Medium" | "Low";
  category: string;
}

const cookies = new Cookies();

export function storeJwt(accessToken: string, refreshToken: string): void {
  cookies.set("accessToken", accessToken);
  cookies.set("refreshToken", refreshToken);
}

export function getJwt(tokenType: string) {
  return cookies.get(tokenType);
}

export function deleteJwt(): void {
  cookies.remove("accessToken");
  cookies.remove("refreshToken");
}

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
    if (document.getElementById("submitButton")!.innerText == "Login") {
      try {
        const response = await fetch(
          `${stateVariables.url}/${stateVariables.login}`,
          {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          loginMessage.innerText = "Network response was not ok";
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        if (!(responseData.accessToken && responseData.refreshToken)) {
          throw new Error(responseData);
        }
        storeJwt(responseData.accessToken, responseData.refreshToken);
        document.getElementById("login-container")!.style.display = "none";
        document.getElementById("main-container")!.style.display = "flex";
        fetchAndDisplayTodos();
      } catch (error) {
        console.error("Error Logging In:", error); // Handle error
        loginMessage.innerText = "Invalid Credentials";
      }
    } else {
      try {
        const uname = (document.getElementById("name") as HTMLInputElement)
          .value;
        const response = await fetch(
          `${stateVariables.url}/${stateVariables.register}`,
          {
            method: "POST",
            body: JSON.stringify({
              name: uname,
              email: email,
              password: password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          loginMessage.innerText = "Network response was not ok";
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        loginMessage.innerText = responseData;
      } catch (error) {
        console.error("Error Registering:", error); // Handle error
        loginMessage.innerText = "User Already Exists";
      }
    }
  });

  document
    .getElementById("switchButton")!
    .addEventListener("click", async function () {
      if (document.getElementById("switchButton")!.innerText == "Login") {
        document.getElementById("form-title")!.textContent = "Login";
        document.getElementById("name-input-div")!.style.display = "none";
        document.getElementById("name")!.style.display = "none";
        document.getElementById("submitButton")!.innerText = "Login";
        document.getElementById("switchButton")!.innerText = "Register";
      } else {
        document.getElementById("form-title")!.textContent = "Register";
        document.getElementById("name-input-div")!.style.display = "flex";
        document.getElementById("name")!.style.display = "block";
        document.getElementById("submitButton")!.innerText = "Register";
        document.getElementById("switchButton")!.innerText = "Login";
      }
    });

  function logout() {
    document.getElementById("login-container")!.style.display = "block";
    document.getElementById("main-container")!.style.display = "none";
    deleteJwt();
  }

  var todosData: Todo[] = [];
  var editingTodo: string | null = null;

  document.getElementById("logout")!.addEventListener("click", () => {
    logout();
  });

  async function fetchAndDisplayTodos() {
    const response = await makeApiCall(fetchData);
    if (response!.status == 200) {
      todosData = response!.data! as [];
      displayTodos();
    } else {
      logout();
    }
  }

  function displayTodos(): void {
    const todosList = document.getElementById("todosList") as HTMLElement;
    todosList.innerHTML = "";
    todosData.forEach((todo) => {
      const todoItem = document.createElement("div");
      todoItem.className = "todo-item";

      const todoContent = document.createElement("div");
      todoContent.innerHTML = `
          <strong>${todo.title}</strong> - ${todo.description} - ${todo.dueDate} - ${todo.priority} - ${todo.category}
      `;

      const buttons = document.createElement("div");

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.onclick = () => deleteTodo(todo.id!);

      const editButton = document.createElement("button");
      editButton.innerText = "Edit";
      editButton.onclick = () => editTodo(todo.id!);

      buttons.appendChild(editButton);
      buttons.appendChild(deleteButton);

      todoItem.appendChild(todoContent);
      todoItem.appendChild(buttons);
      todosList.appendChild(todoItem);
    });
  }

  async function addOrEditTodo() {
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const description = (
      document.getElementById("description") as HTMLInputElement
    ).value;
    const dueDate = (document.getElementById("dueDate") as HTMLInputElement)
      .value;
    const priority = (document.getElementById("priority") as HTMLSelectElement)
      .value as "High" | "Medium" | "Low";
    const category = (document.getElementById("category") as HTMLInputElement)
      .value;

    if (title && description && dueDate && priority && category) {
      const newTodo: Todo = {
        title,
        description,
        completed: false,
        dueDate,
        priority,
        category,
      };

      if (editingTodo) {
        const response = await makeApiCall(updateData, newTodo, editingTodo);
        if (response!.status == 200) {
          (document.getElementById("add-todo") as HTMLInputElement).innerHTML =
            "Add Todo";
          fetchAndDisplayTodos();
          clearForm();
        } else {
          logout();
        }

        editingTodo = null;
      } else {
        const response = await makeApiCall(createData, newTodo);

        if (response!.status == 200) {
          fetchAndDisplayTodos();
          clearForm();
        } else {
          logout();
        }
      }
    } else {
      alert("Please fill in all fields");
    }
  }

  async function deleteTodo(id: string) {
    const response = await makeApiCall(deleteData, id);
    if (response!.status == 200) {
      fetchAndDisplayTodos();
    } else {
      logout();
    }
  }

  async function editTodo(id: string) {
    const todo = todosData.find(({ id: todoId }) => todoId == id)!;

    (document.getElementById("title") as HTMLInputElement).value = todo.title;
    (document.getElementById("description") as HTMLInputElement).value =
      todo.description;
    (document.getElementById("dueDate") as HTMLInputElement).value =
      todo.dueDate;
    (document.getElementById("priority") as HTMLSelectElement).value =
      todo.priority;
    (document.getElementById("category") as HTMLInputElement).value =
      todo.category;
    (document.getElementById("add-todo") as HTMLInputElement).innerHTML =
      "Edit Todo";
    editingTodo = id;
  }

  function clearForm(): void {
    (document.getElementById("title") as HTMLInputElement).value = "";
    (document.getElementById("description") as HTMLInputElement).value = "";
    (document.getElementById("dueDate") as HTMLInputElement).value = "";
    (document.getElementById("priority") as HTMLSelectElement).value = "High";
    (document.getElementById("category") as HTMLInputElement).value = "";
  }

  const addTodoBtn = document.getElementById("add-todo") as HTMLElement;
  addTodoBtn.addEventListener("click", () => {
    addOrEditTodo();
  });
});

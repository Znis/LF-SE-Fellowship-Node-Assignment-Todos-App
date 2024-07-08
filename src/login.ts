import { stateVariables } from "./stateVariable";

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
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        loginMessage.innerText = "Network response was not ok";
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log(responseData); // Handle success response
      loginMessage.innerText = responseData;
      sessionStorage.setItem("authenticated", "true");
      document.getElementById("login-container")!.style.display = "none";
      document.getElementById("main-container")!.style.display = "flex";
      sessionStorage.setItem(
        "creds",
        JSON.stringify({
          email: email,
          password: password,
        })
      );
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
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        loginMessage.innerText = "Network response was not ok";
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log(responseData); // Handle success response
      loginMessage.innerText = responseData;
      sessionStorage.setItem("authenticated", "true");
      sessionStorage.setItem(
        "creds",
        JSON.stringify({
          email: email,
          password: password,
        })
      );
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Error Registering:", error); // Handle error
      loginMessage.innerText = "User Already Exists";
    }
});
});

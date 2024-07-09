import { getJwt, storeJwt, Todo } from "./main";
import { stateVariables } from "./stateVariable";

interface response {
  error: string;
  status: number;
  data: string | [];
}

export const fetchData = async () => {
  try {
    const response = await fetch(
      `${stateVariables.url}/${stateVariables.todos}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getJwt("accessToken")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const createData = async (newTodo: Todo) => {
  try {
    const response = await fetch(
      `${stateVariables.url}/${stateVariables.todos}/${stateVariables.create}`,
      {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getJwt("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add todo");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const updateData = async (newTodo: Todo, editingTodo: string) => {
  try {
    const response = await fetch(
      `${stateVariables.url}/${stateVariables.todos}/${stateVariables.update}/${editingTodo}`,
      {
        method: "PUT",
        body: JSON.stringify(newTodo),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getJwt("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const deleteData = async (id: string) => {
  try {
    const response = await fetch(
      `${stateVariables.url}/${stateVariables.todos}/${stateVariables.del}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getJwt("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to Delete todo");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};

const fetchAcessToken: () => any = async () => {
  try {
    const response = await fetch(
      `${stateVariables.url}/${stateVariables.auth}/${stateVariables.refresh}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getJwt("refreshToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to Delete todo");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};

export async function makeApiCall(
  callbackFn: (...args: any[]) => any,
  ...args: any[]
) {
  const response: response = await callbackFn(...args);
  if (!response) {
    return { status: 401 };
  }

  if (response.status != 200) {
    const tokenResponse: response = await fetchAcessToken();
    if (tokenResponse.status != 200) {
      return { status: 401 };
    }
    storeJwt(tokenResponse.data as string, getJwt("refreshToken")!);
    const response: response = await callbackFn(...args);
    if (!response) {
      return { status: 401 };
    } else {
      return { status: 200, data: response.data };
    }
  } else {
    return { status: 200, data: response.data };
  }
}

import { baseKnexConfig } from "../knexFile";
import knex from "knex";
import Itodos from "../interfaces/todos";

const knexInstance = knex(baseKnexConfig);

export async function getTodos(userId: string) {
  try {
    const resultData = await knexInstance
      .select("*")
      .from("todos")
      .where("user_id", userId)
      .then(function (data) {
        return data;
      });
    return resultData;
  } catch (error) {
    console.log(error);
  }
}

export async function createTodos(userId: string, todos: Itodos) {
  try {
    const databaseInsert = await knexInstance
      .insert({
        title: todos.title,
        description: todos.description,
        completed: todos.completed,
        dueDate: todos.dueDate,
        priority: todos.priority,
        category: todos.category,
        user_id: userId,
      })
      .into("todos")
      .then(function () {
        return {
          modelResponseCode: 200,
          queryResult: todos,
        };
      });
    return databaseInsert;
  } catch (error) {
    console.log(error);
    return {
      modelResponseCode: 400,
      queryResult: null,
    };
  }
}
export async function updateTodosById(
  userId: string,
  id: string,
  todo: Itodos
) {
  try {
    const ownership = await checkTodoOwnership(userId, id);
    if(!ownership){
      return {
        modelResponseCode: 403,
        queryResult: null
      };
    }
    const resultData = await knexInstance("todos")
      .where("id", id)
      .update({
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        dueDate: todo.dueDate,
        priority: todo.priority,
        category: todo.category,
        user_id: userId,
      })
      .then(function (data) {
        if (!data) {
          return {
            modelResponseCode: 400,
            queryResult: null,
          };
        }
        return {
          modelResponseCode: 200,
          queryResult: todo,
        };
      });
      return resultData;
 
  } catch (error) {
    console.log(error);
    return {
      modelResponseCode: 400,
      queryResult: null,
    };
  }
}
export async function deleteTodosById(userId: string, id: string) {
  try {
    const ownership = await checkTodoOwnership(userId, id);
    if(!ownership){
      return {
        modelResponseCode: 403,
        queryResult: null
      };
    }
    const resultData = await knexInstance("todos")
      .where("id", id)
      .andWhere("user_id", userId)
      .del()
      .then(function (data) {
        if (!data) {
          return {
            modelResponseCode: 400,
            queryResult: false,
          };
        }
        return {
          modelResponseCode: 200,
          queryResult: true,
        };
      });
    return resultData;
  } catch (error) {
    console.log(error);
    return {
      modelResponseCode: 400,
      queryResult: false,
    };
  }
}

async function checkTodoOwnership(userId: string, id: string) {
  try {
    const resultData = (await knexInstance
      .select("user_id")
      .from("todos")
      .where("id", id)

      .then(function (data) {
        return data;
      }));
      if(!resultData.length){
        return false;
      }
    if (resultData[0].user_id == userId) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
}

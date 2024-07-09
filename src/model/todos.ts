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
        return 200;
      });
    return databaseInsert;
  } catch (error) {
    console.log(error);
    return 400;
  }
}
export async function updateTodosById(
  userId: string,
  id: string,
  todos: Itodos
) {
  try {
    const resultData = await knexInstance("todos")
      .where("id", id)
      .update({
        title: todos.title,
        description: todos.description,
        completed: todos.completed,
        dueDate: todos.dueDate,
        priority: todos.priority,
        category: todos.category,
        user_id: userId,
      })
      .then(function (data) {
        if (data === 1) {
          return 200;
        } else {
          return 400;
        }
      });
    return resultData;
  } catch (error) {
    console.log(error);
    return 400;
  }
}
export async function deleteTodosById(userId: string, id: string) {
  try {
    const resultData = await knexInstance("todos")
      .where("id", id)
      .andWhere("user_id", userId)
      .del()
      .then(function (data) {
        if (data === 0) {
          return 400;
        } else {
          return 200;
        }
      });
    return resultData;
  } catch (error) {
    console.log(error);
    return 400;
  }
}

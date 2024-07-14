import { baseKnexConfig } from "../knexFile";
import knex from "knex";
import Itodos from "../interfaces/todos";
import loggerWithNameSpace from "../utils/logger";

const knexInstance = knex(baseKnexConfig);
const logger = loggerWithNameSpace("Todos Model");

export async function getTodos(userId: string) {
  try {
    logger.info("Querying database to get Todos");
    const resultData = await knexInstance
      .select("*")
      .from("todos")
      .where("user_id", userId);

    logger.info("Query to get Todos completed");
    return resultData;
  } catch (error) {
    logger.error("Query to get Todos could not be completed");
    console.log(error);
    return null;
  }
}

export async function createTodos(userId: string, todos: Itodos) {
  try {
    logger.info("Attempting to insert Todo in database");
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
      .into("todos");

    if (!databaseInsert) {
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }

    logger.info("Insertion of Todo in database completed");
    return {
      modelResponseCode: 200,
      queryResult: todos,
    };
  } catch (error) {
    logger.error("Insertion of Todo in database could not be completed");
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
    logger.info("Atemmpting to verify Todo ownership");
    const ownership = await checkTodoOwnership(userId, id);
    if (!ownership) {
      logger.error("Todo ownership could not be verified");
      return {
        modelResponseCode: 403,
        queryResult: null,
      };
    }
    logger.info("Todo ownership verified");
    logger.info("Attempting to update Todo in database");
    const resultData = await knexInstance
      .update({
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        dueDate: todo.dueDate,
        priority: todo.priority,
        category: todo.category,
        user_id: userId,
      })
      .from("todos")
      .where("id", id);
    if (!resultData) {
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }

    logger.info("Updation of Todo in database completed");
    return {
      modelResponseCode: 200,
      queryResult: todo,
    };
  } catch (error) {
    logger.error("Updation of Todo in database could not be completed");
    console.log(error);
    return {
      modelResponseCode: 400,
      queryResult: null,
    };
  }
}
export async function deleteTodosById(userId: string, id: string) {
  try {
    logger.info("Atemmpting to verify Todo ownership");
    const ownership = await checkTodoOwnership(userId, id);
    if (!ownership) {
      logger.error("Todo ownership could not be verified");
      return {
        modelResponseCode: 403,
        queryResult: null,
      };
    }
    logger.info("Attempting to delete Todo from database");
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
    logger.info("Deletion of Todo from database completed");
    return resultData;
  } catch (error) {
    logger.error("Deletion of Todo from database could not be completed");
    console.log(error);
    return {
      modelResponseCode: 400,
      queryResult: false,
    };
  }
}

export async function checkTodoOwnership(userId: string, id: string) {
  try {
    const resultData = await knexInstance
      .select("user_id")
      .from("todos")
      .where("id", id);

    if (!resultData.length) {
      return false;
    }
    if (resultData[0].user_id == userId) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

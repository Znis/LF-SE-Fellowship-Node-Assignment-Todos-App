import { checkTodoOwnershipQuery, createTodosQuery, getTodosCountQuery, getTodosQuery, getTodosQueryParams, Itodos } from "../interfaces/todos";
import loggerWithNameSpace from "../utils/logger";
import { BaseModel } from "./base";

const logger = loggerWithNameSpace("Todos Model");

export default class TodosModel extends BaseModel {
  static async getCount(userId: string) {
    try {
      logger.info("Querying database to get Todos");
      const resultData: getTodosCountQuery = await this.queryBuilder()
        .count("*")
        .table("todos")
        .where("user_id", userId).first();

      logger.info("Query to get Todos completed");
      return resultData;
    } catch (error) {
      logger.error("Query to get Todos could not be completed");
      console.log(error);
    }
  }
  static async getTodos(filter: getTodosQueryParams, userId: string) {
    try {
      logger.info("Querying database to get Todos");
      const resultData: getTodosQuery[]  = await this.queryBuilder()
        .select("*")
        .from("todos")
        .limit(filter.size)
        .offset((filter.page - 1) * filter.size)
        .where("user_id", userId);

      logger.info("Query to get Todos completed");
      return resultData;
    } catch (error) {
      logger.error("Query to get Todos could not be completed");
      console.log(error);
    }
  }

  static async createTodos(userId: string, todos: Itodos) {
    try {
      logger.info("Attempting to insert Todo in database");
      const databaseInsert: createTodosQuery[] = await this.queryBuilder()
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
  static async updateTodosById(userId: string, id: string, todo: Itodos) {
    try {
      logger.info("Atemmpting to verify Todo ownership");
      const ownership: boolean = await this.checkTodoOwnership(userId, id);
      if (!ownership) {
        logger.error("Todo ownership could not be verified");
        return {
          modelResponseCode: 403,
          queryResult: null,
        };
      }
      logger.info("Todo ownership verified");
      logger.info("Attempting to update Todo in database");
      const resultData: number = await this.queryBuilder()
        .update({
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          dueDate: todo.dueDate,
          priority: todo.priority,
          category: todo.category,
          user_id: userId,
        })
        .into("todos")
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
  static async deleteTodosById(userId: string, id: string) {
    try {
      logger.info("Atempting to verify Todo ownership");
      const ownership: boolean = await this.checkTodoOwnership(userId, id);
      if (!ownership) {
        logger.error("Todo ownership could not be verified");
        return {
          modelResponseCode: 403,
          queryResult: null,
        };
      }
      logger.info("Attempting to delete Todo from database");
      const resultData: number = await this.queryBuilder()
        .del()
        .from("todos")
        .where("id", id)
        .andWhere("user_id", userId);
        
        

      if (!resultData) {
        return {
          modelResponseCode: 400,
          queryResult: false,
        };
      }
      logger.info("Deletion of Todo from database completed");

      return {
        modelResponseCode: 200,
        queryResult: true,
      };
    } catch (error) {
      logger.error("Deletion of Todo from database could not be completed");
      console.log(error);
      return {
        modelResponseCode: 400,
        queryResult: false,
      };
    }
  }

  static async checkTodoOwnership(userId: string, id: string) {
    try {
      const resultData: checkTodoOwnershipQuery = await this.queryBuilder()
        .select("user_id")
        .from("todos")
        .where("id", id)
        .first()
     
      if (!resultData) {
        return false;
      }
      if (resultData.userId == userId){
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }
}

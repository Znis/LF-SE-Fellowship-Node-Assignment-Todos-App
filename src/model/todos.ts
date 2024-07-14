import { baseKnexConfig } from "../knexFile";
import knex, { Knex } from "knex";
import Itodos from "../interfaces/todos";
import loggerWithNameSpace from "../utils/logger";
import { Logger } from "winston";

export default class TodosModel {
  knexInstance: Knex;
  logger: Logger;
  constructor() {
    this.knexInstance = knex(baseKnexConfig);
    this.logger = loggerWithNameSpace("Todos Model");
  }
  async getTodos(userId: string) {
    try {
      this.logger.info("Querying database to get Todos");
      const resultData = await this.knexInstance
        .select("*")
        .from("todos")
        .where("user_id", userId);

      this.logger.info("Query to get Todos completed");
      return resultData;
    } catch (error) {
      this.logger.error("Query to get Todos could not be completed");
      console.log(error);
      return null;
    }
  }

  async createTodos(userId: string, todos: Itodos) {
    try {
      this.logger.info("Attempting to insert Todo in database");
      const databaseInsert = await this.knexInstance
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

      this.logger.info("Insertion of Todo in database completed");
      return {
        modelResponseCode: 200,
        queryResult: todos,
      };
    } catch (error) {
      this.logger.error("Insertion of Todo in database could not be completed");
      console.log(error);
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }
  }
  async updateTodosById(userId: string, id: string, todo: Itodos) {
    try {
      this.logger.info("Atemmpting to verify Todo ownership");
      const ownership = await this.checkTodoOwnership(userId, id);
      if (!ownership) {
        this.logger.error("Todo ownership could not be verified");
        return {
          modelResponseCode: 403,
          queryResult: null,
        };
      }
      this.logger.info("Todo ownership verified");
      this.logger.info("Attempting to update Todo in database");
      const resultData = await this.knexInstance
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

      this.logger.info("Updation of Todo in database completed");
      return {
        modelResponseCode: 200,
        queryResult: todo,
      };
    } catch (error) {
      this.logger.error("Updation of Todo in database could not be completed");
      console.log(error);
      return {
        modelResponseCode: 400,
        queryResult: null,
      };
    }
  }
  async deleteTodosById(userId: string, id: string) {
    try {
      this.logger.info("Atemmpting to verify Todo ownership");
      const ownership = await this.checkTodoOwnership(userId, id);
      if (!ownership) {
        this.logger.error("Todo ownership could not be verified");
        return {
          modelResponseCode: 403,
          queryResult: null,
        };
      }
      this.logger.info("Attempting to delete Todo from database");
      const resultData = await this.knexInstance("todos")
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
      this.logger.info("Deletion of Todo from database completed");
      return resultData;
    } catch (error) {
      this.logger.error(
        "Deletion of Todo from database could not be completed"
      );
      console.log(error);
      return {
        modelResponseCode: 400,
        queryResult: false,
      };
    }
  }

  async checkTodoOwnership(userId: string, id: string) {
    try {
      const resultData = await this.knexInstance
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
}

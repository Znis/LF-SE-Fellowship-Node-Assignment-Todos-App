import {
  checkTodoOwnershipQuery,
  getTodosCountQuery,
  getTodosQuery,
  getTodosQueryParams,
  Itodos,
} from "../interfaces/todos";
import { ModelError } from "../error/modelError";
import { ForbiddenError } from "../error/forbiddenError";
import loggerWithNameSpace from "../utils/logger";
import TodosModel from "../model/todos";

const logger = loggerWithNameSpace("Todos Service");

export default class TodosServices {
  static async getTodos(params: getTodosQueryParams, userId: string) {
    logger.info("Getting Todos from Todos Model");
    const data: getTodosQuery[] = await TodosModel.getTodos(params, userId);
    logger.info("Query to get Todos completed");
    const count: getTodosCountQuery = await TodosModel.getCount(userId);
    logger.info("Query to get Todos's count completed");
    const meta = { page: params.page, size: data.length, total: +count.count };
    return { meta, data };
  }

  static async createTodos(userId: string, data: Itodos) {
    logger.info(`Creating Todo for userId ${userId}`);
    const queryResult: number[] = await TodosModel.createTodos(userId, data);
    if (!queryResult) {
      logger.error(`Could not create Todo for userId ${userId}`);
      throw new ModelError("Could not create Todo");
    }
    logger.info("Insertion of Todo in database completed");
    return data;
  }

  static async updateTodos(userId: string, id: string, data: Itodos) {
    logger.info(`Updating Todo with id ${id} for userId ${userId}`);
    const ownership: boolean = await this.checkTodoOwnership(userId, id);
    if (!ownership) {
      logger.error(`Todo with id ${id} is not authorized for userId ${userId}`);
      throw new ForbiddenError("Forbidden");
    }
    logger.info("Todo ownership verified");
    logger.info("Attempting to update Todo in database");
    const queryResult: number = await TodosModel.updateTodosById(
      userId,
      id,
      data
    );
    if (!queryResult) {
      logger.error(`Could not update Todo with id ${id} for userId ${userId}`);
      throw new ModelError("Could not update Todo");
    }
    logger.info("Updation of Todo in database completed");
    return data;
  }

  static async deleteTodos(userId: string, id: string) {
    logger.info(`Deleting Todo with id ${id} for userId ${userId}`);
    const ownership: boolean = await this.checkTodoOwnership(userId, id);
    if (!ownership) {
      logger.error(`Todo with id ${id} is not authorized for userId ${userId}`);
      throw new ForbiddenError("Forbidden");
    }
    logger.info("Attempting to delete Todo from database");
    const queryResult: number = await TodosModel.deleteTodosById(userId, id);
    if (!queryResult) {
      logger.error(`Could not delete Todo with id ${id} for userId ${userId}`);
      throw new ModelError("Could not delete Todo");
    }
    logger.info("Deletion of Todo from database completed");
    return true;
  }
  static async checkTodoOwnership(userId: string, id: string) {
    logger.info("Atempting to verify Todo ownership");
    const queryResult: checkTodoOwnershipQuery =
      await TodosModel.checkTodoOwnership(id);
    if (queryResult.userId != userId) {
      return false;
    }
    return true;
  }
}

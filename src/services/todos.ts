import  { getTodosQueryParams, Itodos } from "../interfaces/todos";
import { ModelError } from "../error/modelError";
import { ForbiddenError } from "../error/forbiddenError";
import loggerWithNameSpace from "../utils/logger";
import TodosModel from "../model/todos";


const logger = loggerWithNameSpace("Todos Service");

export default class TodosServices{
static async getTodos(params: getTodosQueryParams,userId: string) {
  logger.info("Getting Todos from Todos Model");
  const data = await TodosModel.getTodos(params, userId);
  const count = await TodosModel.getCount(userId);
  const meta = {page: params.page, size: data.length, total: +count.count};
  return {meta, data};
}

static async createTodos(userId: string, data: Itodos) {
  logger.info(`Creating Todo for userId ${userId}`);
  const { modelResponseCode, queryResult } = await TodosModel.createTodos(
    userId,
    data
  );
  if (modelResponseCode != 200) {
    logger.error(`Could not create Todo for userId ${userId}`);
    throw new ModelError("Could not create Todo");
  }
  return queryResult;
}

static async updateTodos(userId: string, id: string, data: Itodos) {
  logger.info(`Updating Todo with id ${id} for userId ${userId}`);
  const { modelResponseCode, queryResult } = await TodosModel.updateTodosById(
    userId,
    id,
    data
  );
  if (modelResponseCode == 403) {
    logger.error(`Todo with id ${id} is not authorized for userId ${userId}`);
    throw new ForbiddenError("Forbidden");
  }
  if (modelResponseCode != 200) {
    logger.error(`Could not update Todo with id ${id} for userId ${userId}`);
    throw new ModelError("Could not update Todo");
  }
  return queryResult;
}

static async deleteTodos(userId: string, id: string) {
  logger.info(`Deleting Todo with id ${id} for userId ${userId}`);
  const { modelResponseCode, queryResult } = await TodosModel.deleteTodosById(
    userId,
    id
  );
  if (modelResponseCode == 403) {
    logger.error(`Todo with id ${id} is not authorized for userId ${userId}`);
    throw new ForbiddenError("Forbidden");
  }
  if (modelResponseCode != 200) {
    logger.error(`Could not delete Todo with id ${id} for userId ${userId}`);
    throw new ModelError("Could not delete Todo");
  }
  return queryResult;
}
}
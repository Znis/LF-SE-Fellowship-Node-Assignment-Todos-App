import Itodos from "../interfaces/todos";
import * as TodosModel from "../model/todos";
import { ModelError } from "../error/modelError";
import { ForbiddenError } from "../error/forbiddenError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Todos Service");

export async function getTodos(userId: string) {
  logger.info("Getting Todos from Todos Model");
  const data = await TodosModel.getTodos(userId);
  return data;
}

export async function createTodos(userId: string, data: Itodos) {
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

export async function updateTodos(userId: string, id: string, data: Itodos) {
  logger.info(`Updating Todo with id ${id} for userId ${userId}`);
  const { modelResponseCode, queryResult } = await TodosModel.updateTodosById(
    userId,
    id,
    data
  );
  if(modelResponseCode == 403){
    logger.error(`Todo with ${id} is not authorized for userId ${userId}`);
    throw new ForbiddenError("Forbidden");
  }
  if (modelResponseCode != 200) {
    logger.error(`Could not update Todo with ${id} for userId ${userId}`);
    throw new ModelError("Could not update Todo");
  }
  return queryResult;
}

export async function deleteTodos(userId: string, id: string) {
  logger.info(`Deleting Todo with id ${id} for userId ${userId}`);
  const { modelResponseCode, queryResult } = await TodosModel.deleteTodosById(
    userId,
    id
  );
  if(modelResponseCode == 403){
    logger.error(`Todo with ${id} is not authorized for userId ${userId}`);
    throw new ForbiddenError("Forbidden");
  }
  if (modelResponseCode != 200) {
    logger.error(`Could not delete Todo with ${id} for userId ${userId}`);
    throw new ModelError("Could not delete Todo");
  }
  return queryResult;
}

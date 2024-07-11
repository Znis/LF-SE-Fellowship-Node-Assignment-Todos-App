import HttpStatusCode from "http-status-codes";
import Itodos from "../interfaces/todos";
import * as TodosModel from "../model/todos";
import { ModelError } from "../../error/modelError";

export async function getTodos(userId: string) {
  const data = await TodosModel.getTodos(userId);
  return data;
}

export async function createTodos(userId: string, data: Itodos) {
  const { modelResponseCode, queryResult } = await TodosModel.createTodos(
    userId,
    data
  );
  if (modelResponseCode != 200) {
    throw new ModelError();
  }
  return queryResult;
}

export async function updateTodos(userId: string, id: string, data: Itodos) {
  const { modelResponseCode, queryResult } = await TodosModel.updateTodosById(
    userId,
    id,
    data
  );
  if (modelResponseCode != 200) {
    throw new ModelError("Could not update Todo");
  }
  return queryResult;
}

export async function deleteTodos(userId: string, id: string) {
  const { modelResponseCode, queryResult } = await TodosModel.deleteTodosById(
    userId,
    id
  );
  if (modelResponseCode != 200) {
    throw new ModelError("Could not delete Todo");
  }
  return queryResult;
}

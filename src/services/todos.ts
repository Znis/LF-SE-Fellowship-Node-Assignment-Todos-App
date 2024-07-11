import HttpStatusCode from 'http-status-codes';
import Itodos from "../interfaces/todos";
import * as TodosModel from "../model/todos";
import { ModelError } from '../../error/modelError';

export async function getTodos(userId: string) {
  const data = await TodosModel.getTodos(userId);
  return data;

}

export async function createTodos(userId: string, data: Itodos) {
  const { modelResponseCode, queryResult } = await TodosModel.createTodos(userId, data);
  if(modelResponseCode != 200){
    return createResponse(new ModelError("Could not create Todo"), undefined);
  }
  return createResponse(undefined, queryResult);

}

export async function updateTodos(userId: string, id: string, data: Itodos) {
  const { modelResponseCode, queryResult } = await TodosModel.updateTodosById(userId, id, data);
  if(modelResponseCode != 200){
    return createResponse(new ModelError("Could not update Todo"), undefined);
  }
  return createResponse(undefined, queryResult);

}

export async function deleteTodos(userId: string, id: string) {
  const { modelResponseCode, queryResult } = await TodosModel.deleteTodosById(userId, id);
  if(modelResponseCode != 200){
    return createResponse(new ModelError("Could not delete Todo"), undefined);
  }
  return createResponse(undefined, queryResult);
}

function createResponse(error?, queryResult?){
  return {error: error || null, queryResult: queryResult || null};
}
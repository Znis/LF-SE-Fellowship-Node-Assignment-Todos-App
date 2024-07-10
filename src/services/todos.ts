import Itodos from "../interfaces/todos";
import * as TodosModel from "../model/todos";

export async function getTodos(userId: string) {
  const data = await TodosModel.getTodos(userId);
  return { error: "", status: 200, data: data };
}

export async function createTodos(userId: string, data: Itodos) {
  const modelResponseCode = await TodosModel.createTodos(userId, data);
  const modelResponse = {
    status: modelResponseCode,
    error: modelResponseCode == 200 ? "" : "Creation Failed",
    data: "",
  };
  return modelResponse;
}

export async function updateTodos(userId: string, id: string, data: Itodos) {
  const modelResponseCode = await TodosModel.updateTodosById(userId, id, data);
  const modelResponse = {
    status: modelResponseCode,
    error: modelResponseCode == 200 ? "" : "Update Failed",
    data: "",
  };
  return modelResponse;
}

export async function deleteTodos(userId: string, id: string) {
  const modelResponseCode = await TodosModel.deleteTodosById(userId, id);
  const modelResponse = {
    status: modelResponseCode,
    error: modelResponseCode == 200 ? "" : "Deletion Failed",
    data: "",
  };
  return modelResponse;
}

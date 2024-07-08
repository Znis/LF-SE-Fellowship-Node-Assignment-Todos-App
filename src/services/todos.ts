import Itodos from "../interfaces/todos";
import Iuser from "../interfaces/user";
import * as TodosModel from "../model/todos";


export async function getTodos(userId: string){
const data = await TodosModel.getTodos(userId);
return data;
}

export async function createTodos(userId: string, data: Itodos){
    const modelResponseCode = await TodosModel.createTodos(userId, data);
    const modelResponse = {
        responseCode: modelResponseCode,
        responseMessage: modelResponseCode == 200 ? "Creation Successful" : "Creation Failed"
    }
    return modelResponse;
}

export async function updateTodos(userId: string, id: string, data: Itodos){
   const modelResponseCode = await TodosModel.updateTodosById(userId, id, data);
   const modelResponse = {
    responseCode: modelResponseCode,
    responseMessage: modelResponseCode == 200 ? "Update Successful" : "Update Failed"
}
   return modelResponse;
}

export async function deleteTodos(userId: string, id: string){
    const modelResponseCode = await TodosModel.deleteTodosById(userId, id);
    const modelResponse = {
        responseCode: modelResponseCode,
        responseMessage: modelResponseCode == 200 ? "Deletion Successful" : "Deletion Failed"
    }
    return modelResponse;
}
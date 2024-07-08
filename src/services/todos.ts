import Itodos from "../interfaces/todos";
import * as TodosModel from "../model/todos";


export function getTodos(){
const data = TodosModel.getTodos();
return data;
}

export function createTodos(data: Itodos){
    const modelResponse = TodosModel.createTodos(data);
    return modelResponse;
}

export function updateTodos(id: string, data: Itodos){
   const modelResponse = TodosModel.updateTodosById(id, data);
   return modelResponse;
}

export function deleteTodos(id: string){
    const modelResponse = TodosModel.deleteTodosById(id);
    return modelResponse;
}
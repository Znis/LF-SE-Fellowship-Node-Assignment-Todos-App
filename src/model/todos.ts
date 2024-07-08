import Itodos from "../interfaces/todos";
import { objectEqual } from "../utils/utils";

let todosData = [
    {
        id: "1",
        title: "Drink Water",
        description: "Drink 8 glasses of water throughout the day",
        completed: false,
        dueDate: "2024-07-10",
        priority: "High",
        category: "Health"
    },
    {
        id: "2",
        title: "Exercise",
        description: "Go for a 30-minute run in the park",
        completed: false,
        dueDate: "2024-07-11",
        priority: "Medium",
        category: "Fitness"
    },
    {
        id: "3",
        title: "Read a Book",
        description: "Read 50 pages of a fiction novel",
        completed: false,
        dueDate: "2024-07-12",
        priority: "Low",
        category: "Leisure"
    },
    {
        id: "4",
        title: "Grocery Shopping",
        description: "Buy fruits, vegetables, and other essentials",
        completed: false,
        dueDate: "2024-07-13",
        priority: "High",
        category: "Errands"
    },
    {
        id: "5",
        title: "Work on Project",
        description: "Complete the initial draft of the project report",
        completed: false,
        dueDate: "2024-07-14",
        priority: "High",
        category: "Work"
    }
];


export function getTodos(){

    return todosData;
}

export function createTodos(todos: Itodos){
    try{
        for(let i=0; i<todosData.length; i++){
            const  {id, ...todoData} = todosData[i];
            if(objectEqual(todoData, todos) ) return {responseCode: 400, responseMessage: "Todo Already Exists"};
        }
        todosData.push({
            id: `${todosData.length + 1}`,
            ...todos
        });

        return {responseCode: 201, responseMessage: "Todo Created Successfully"};
    } catch {
        return {responseCode: 400, responseMessage: "Todo Creation Failed"};
    }

    
}
export function updateTodosById(id: string, todos: Itodos){
    try{
        const todosToBeUpdated = todosData.find(({id: todosId}) => todosId === id);
        if(todosToBeUpdated){
            Object.assign(todosToBeUpdated, {id: id, ...todos});

        return {responseCode: 201, responseMessage: "Todo Updated Successfully"};
    }else{
        return {responseCode: 400, responseMessage: "Todo Does Not Exist"};
    }
    } catch {
        return {responseCode: 400, responseMessage: "Todo Updation Failed"};
    }

}
export function deleteTodosById(id: string){
    try{
        const todosToBeDeleted = todosData.find(({id: todosId}) => todosId === id);
        if(todosToBeDeleted){
        todosData = todosData.filter(({id: todosId}) => todosId != id );
        console.log(todosData)
        return {responseCode: 201, responseMessage: "Todo Deleted Successfully"};
        }else{
            return {responseCode: 400, responseMessage: "Todo Does Not Exist"};
        }
    } catch {
        return {responseCode: 400, responseMessage: "Todo Deletion Failed"};
    }

}

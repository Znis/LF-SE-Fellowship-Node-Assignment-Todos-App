import {Request, Response } from "express";
import * as TodosService from "../services/todos";
import todosSchema from '../schema/todos';

export function getTodos(req: Request, res: Response){
    const data = TodosService.getTodos();
    return res.json(data);
}
export function createTodos(req: Request, res: Response){
    const data = req.body;
    const {error, value} = todosSchema.validate(data);
    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }
    const {responseMessage, responseCode} = TodosService.createTodos(value);
    return res.status(responseCode).json(responseMessage);
}
export function updateTodos(req: Request, res: Response){
    const {id} = req.params;
    const data = req.body;
    const {error, value} = todosSchema.validate(data);
    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }
    const {responseMessage, responseCode} = TodosService.updateTodos(id, value);
    return res.status(201).json(responseMessage);
    

}
export function deleteTodos(req: Request, res: Response){
   const {id} = req.params; 
   const {responseMessage, responseCode} = TodosService.deleteTodos(id);
   return res.status(responseCode).json(responseMessage);
   
}
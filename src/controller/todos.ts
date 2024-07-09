import { NextFunction, Request, Response } from "express";
import * as TodosService from "../services/todos";
import todosSchema from "../schema/todos";
interface CustomRequest extends Request {
  userId?: string;
}

export async function getTodos(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const currUserId = req.userId;
  const data = await TodosService.getTodos(currUserId!);
  return res.status(201).json(data);
}
export async function createTodos(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const currUserId = req.userId;
  const data = req.body;
  const { error, value } = todosSchema.validate(data);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const response = await TodosService.createTodos(currUserId!, value);
  return res.json(response);
}
export async function updateTodos(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const currUserId = req.userId;

  const { id } = req.params;
  const data = req.body;
  const { error, value } = todosSchema.validate(data);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const response = await TodosService.updateTodos(currUserId!, id, value);
  return res.json(response);
}
export async function deleteTodos(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const currUserId = req.userId;
  const { id } = req.params;
  const response = await TodosService.deleteTodos(currUserId!, id);
  return res.json(response);
}

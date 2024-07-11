import HttpStatusCode from 'http-status-codes';
import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import * as TodosService from "../services/todos";
import todosSchema from "../schema/todos";
import { SchemaError } from '../../error/schemaError';

export async function getTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const currUserId = req.user!.id;
  const data = await TodosService.getTodos(currUserId!);
  res.status(HttpStatusCode.OK).json(data);
}
export async function createTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const currUserId = req.user!.id;
  const data = req.body;
  const { error, value } = todosSchema.validate(data);
  if (error) {
    next(new SchemaError("Input Data Invalid"));
    return;
  }
  const response = await TodosService.createTodos(currUserId!, value);
  res.status(HttpStatusCode.CREATED).json(response);

}
export async function updateTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const currUserId = req.user!.id;

  const { id } = req.params;
  const data = req.body;
  const { error, value } = todosSchema.validate(data);
  if (error) {
    next(new SchemaError("Input Data Invalid"));
    return;
  }
  const response = await TodosService.updateTodos(currUserId!, id, value);
  res.status(HttpStatusCode.OK).json(response);
}
export async function deleteTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const currUserId = req.user!.id;
  const { id } = req.params;
  await TodosService.deleteTodos(currUserId!, id);

  res.status(HttpStatusCode.NO_CONTENT).json("Deleted Successfully");

}

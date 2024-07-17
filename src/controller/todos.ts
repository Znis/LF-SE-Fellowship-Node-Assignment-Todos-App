import HttpStatusCode from "http-status-codes";
import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import TodosService from "../services/todos";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Todos Controller");

export async function getTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currUserId = req.user!.id;
    logger.info("Attempting to get Todos");
    const { meta, data } = await TodosService.getTodos(req.query, currUserId!);
    logger.info("Todos retrieval Successful");
    return res.status(HttpStatusCode.OK).json({ meta: meta, data: data });
  } catch (error) {
    logger.error("Todos fetch Failed");
    next(error);
  }
}

export async function createTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currUserId = req.user!.id;
    const data = req.body;
    logger.info("Attempting to create new Todo");
    const response = await TodosService.createTodos(currUserId!, data);
    logger.info("Todos creation Successful");
    return res.status(HttpStatusCode.CREATED).json({ created: response });
  } catch (error) {
    logger.error("Todos creation Failed");
    next(error);
  }
}
export async function updateTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currUserId = req.user!.id;

    const { id } = req.query;
    const data = req.body;
    logger.info(`Attempting to edit Todo with id ${id}`);
    const response = await TodosService.updateTodos(
      currUserId!,
      id as string,
      data
    );
    logger.info(`Todo with id ${id} updated successfully`);
    return res.status(HttpStatusCode.OK).json({ updated: response });
  } catch (error) {
    logger.error("Todo update failed");
    next(error);
  }
}
export async function deleteTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currUserId = req.user!.id;
    const { id } = req.query;
    logger.info(`Attempting to delete Todo with id ${id}`);
    await TodosService.deleteTodos(currUserId!, id as string);
    logger.info(`Todo with id ${id} deleted successfully`);
    return res.status(HttpStatusCode.NO_CONTENT).json("Deleted Successfully");
  } catch (error) {
    logger.error(`Todo deletion failed`);
    next(error);
  }
}

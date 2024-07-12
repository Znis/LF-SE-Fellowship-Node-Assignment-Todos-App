import HttpStatusCode from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import * as UsersService from "../services/users";
import { SchemaError } from "../error/schemaError";
import { BaseError } from "../error/baseError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Users Controller");

export async function getUserByEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;

    logger.info(`Attempting to fetch user data with email ${body.email}`);
    const data = await UsersService.getUserByEmail(body.email);
    if (!data) {
      logger.error(`No user found with email ${body.email}`);
      next(new BaseError("No User Found"));
      return;
    }
    logger.info(`User with email ${body.email} found`);
    const { password, ...otherData } = data!;
    return res.status(HttpStatusCode.OK).json({ otherData });
  } catch (error) {
    logger.error("User fetch failed");
    next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    logger.info("Attempting to create new user");
    const response = await UsersService.createUser(data);
    logger.info("New user created");
    return res.status(HttpStatusCode.CREATED).json({ created: response });
  } catch (error) {
    logger.error("User creation failed");
    next(error);
  }
}
export async function editUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const data = req.body;
    logger.info(`Attempting to edit user with id ${id}`);
    const response = await UsersService.editUser(id, data);
    logger.info(`User with id ${id} edited`);
    return res.status(HttpStatusCode.OK).json({ edited: response });
  } catch (error) {
    logger.error("User update failed");
    next(error);
  }
}
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    logger.info(`Attempting to delete user with id ${id}`);
    await UsersService.deleteUser(id);
    logger.info(`User with id ${id} deleted`);
    return res.status(HttpStatusCode.NO_CONTENT).json("Deleted Successfully");
  } catch (error) {
    logger.error("User deletion failed");
    next(error);
  }
}

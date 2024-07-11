import HttpStatusCode from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import * as UsersService from "../services/users";
import { userSchema } from "../schema/user";
import { SchemaError } from "../../error/schemaError";
import { BaseError } from "../../error/baseError";

export async function getUserByEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const data = await UsersService.getUserByEmail(body.email);
    if (!data) {
      next(new BaseError("No User Found"));
      return;
    }
    const { password, ...otherData } = data!;
    return res.status(HttpStatusCode.OK).json({ otherData });
  } catch (error) {
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
    const { error, value } = userSchema.validate(data);
    if (error) {
      next(new SchemaError("Input Data Invalid"));
      return;
    }

    const response = await UsersService.createUser(value);

    return res.status(HttpStatusCode.CREATED).json({created:response});
  } catch (error) {
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
    const { error, value } = userSchema.validate(data);
    if (error) {
      next(new SchemaError("Input Data Invalid"));
      return;
    }
    const response = await UsersService.editUser(id, value);
    return res.status(HttpStatusCode.OK).json({edited:response});
  } catch (error) {
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
    await UsersService.deleteUser(id);
    return res.status(HttpStatusCode.NO_CONTENT).json("Deleted Successfully");
  } catch (error) {
    next(error);
  }
}

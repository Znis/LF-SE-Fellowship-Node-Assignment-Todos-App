import  HttpStatusCode  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import * as UsersService from "../services/users";
import userSchema from "../schema/user";
import { SchemaError } from '../../error/schemaError';
import { BaseError } from '../../error/baseError';


export async function getUserByEmail(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  const data = await UsersService.getUserByEmail(body.email);
  if (!data) {
    next(new BaseError("No User Found"));
    return;
  }    
  const {password, ...otherData} = data!;
  res.status(HttpStatusCode.OK).json({otherData});
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const data = req.body;
  const { error, value } = userSchema.validate(data);
  if (error) {
    next(new SchemaError("Input Data Invalid"));
    return;
  }

  const response = await UsersService.createUser(
    value
  );

  res.status(HttpStatusCode.CREATED).json(response);
}
export async function editUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const data = req.body;
  const { error, value } = userSchema.validate(data);
  if (error) {
    next(new SchemaError("Input Data Invalid"));
    return;
  }
  const response = await UsersService.editUser(id, value);
  res.status(HttpStatusCode.OK).json(response);
}
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  await UsersService.deleteUser(id);
  res.status(HttpStatusCode.NO_CONTENT).json("Deleted Successfully");

}

import { NextFunction, Request, Response } from "express";
import * as UsersService from "../services/users";
import userSchema from "../schema/user";
import todosSchema from "../schema/todos";


export async function getUserByEmail(req: Request, res: Response) {
  const body = req.body;
  const data = await UsersService.getUserByEmail(body.email);
  if (data!.length > 0) {
    const {password, ...otherData} = data![0];
    return res.status(200).json({otherData});
  } else {
    return res.status(401).json({error: "Invalid User"});
  }
}

export async function createUser(req: Request, res: Response) {
  const data = req.body;
  const { error, value } = userSchema.validate(data);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { responseMessage, responseCode } = await UsersService.createUser(
    value
  );

  return res.status(responseCode).json(responseMessage);
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
    return res.status(400).json({ error: error.details[0].message });
  }
  const response = await UsersService.editUser(id, value);
  return res.json(response);
}
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const response = await UsersService.deleteUser(id);
  return res.json(response);
}

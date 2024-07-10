import { Request, Response } from "express";
import * as UsersService from "../services/users";
import userSchema from "../schema/user";

export async function getUserByEmail(req: Request, res: Response) {
  const body = req.body;
  const data = await UsersService.getUserByEmail(body.email);
  const {password, ...otherData} = data![0];
  if (data!.length > 0) {
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

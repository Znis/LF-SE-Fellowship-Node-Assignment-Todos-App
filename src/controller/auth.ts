import HttpStatusCode from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import * as AuthService from "../services/auth";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req;
    const authResponse = await AuthService.login(req, res, body);
    return res.status(HttpStatusCode.OK).json(authResponse);
  } catch (error) {
    next(error);
  }
}

//function to generate a new accesstoken with the refreshtoken
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
    const authResponse = await AuthService.refresh(req, res, authorization);

    return res.status(HttpStatusCode.OK).json(authResponse);
  } catch (error) {
    next(error);
  }
}

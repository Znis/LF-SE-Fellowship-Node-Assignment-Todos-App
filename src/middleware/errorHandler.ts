import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth"
import HttpStatusCode from "http-status-codes";
import { UnauthenticatedError } from "../../error/unauthenticatedError";

export function notFoundError(req: Request, res: Response) {
  return res.status(HttpStatusCode.NOT_FOUND).json({
    message: "Not Found",
  });
}
export function genericErrorHandler(
    error:Error,
    req: Request,
    res: Response,
    next:NextFunction
){
    if(error instanceof UnauthenticatedError){
        return res.status(HttpStatusCode.UNAUTHORIZED).json({message: error.message})
    }
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message:"Internal Server Error",
    })
}
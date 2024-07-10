import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { UnauthenticatedError } from "../../error/unauthenticatedError";
import Iuser from "../interfaces/user";


export function auth(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authentication Failed" });
  }
  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
    return res.status(401).json({ error: "Authentication Failed" });
  }

  try {
    const verifiedData = jwt.verify(
      token[1],
      config.jwt.secret!
    ) as Iuser ;
    if (verifiedData) {
      req.user = verifiedData;

    } else {
      return res.status(401).json({ error: "Token Verification failed" });
    }
  } catch {
    next(new UnauthenticatedError("Unauthenticated"));
  }
  next();
}

export function authorize (permission:string){
  return (req:Request,res:Response,next:NextFunction)=>{
      const user =req.user!;
      if (!user.permissions.includes(permission)){
          next (new Error('Forbidden'))
      }
      next();
  }
}
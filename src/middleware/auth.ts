import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import jwt from "jsonwebtoken";
import config from "../config";
import { UnauthenticatedError } from "../../error/unauthenticatedError";
import Iuser from "../interfaces/user";
import { getAssignedPermission } from "../services/auth";
import { ForbiddenError } from "../../error/forbiddenError";

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
    const verifiedData = jwt.verify(token[1], config.jwt.secret!) as Iuser;
    if (!verifiedData) {
      next(new UnauthenticatedError("Unauthenticated"));
      return;
    }
    req.user = verifiedData;

    next();
  } catch {
    next(new UnauthenticatedError("Unauthenticated"));
  }
}

export function authorize(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;

    const permissions = await getAssignedPermission(user.id!);
    if (!permissions!.includes(permission)) {
      next(new ForbiddenError("Forbidden"));
      return;
    }
    next();
  };
}

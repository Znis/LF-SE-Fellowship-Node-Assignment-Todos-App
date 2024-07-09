import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

interface CustomRequest extends Request {
  userId?: string;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
}

export function auth(req: CustomRequest, res: Response, next: NextFunction) {
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
    ) as CustomJwtPayload;
    if (verifiedData) {
      req.userId = verifiedData.id.toString();
      next();
    } else {
      return res.status(401).json({ error: "Token Verification failed" });
    }
  } catch {
    return res.json({ error: "Token Expired", errorCode: 401 });
  }
}

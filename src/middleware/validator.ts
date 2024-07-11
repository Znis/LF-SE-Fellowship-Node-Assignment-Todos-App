import { NextFunction, Request, Response } from "express";
import { func, Schema } from "joi";
import { BadRequestError } from "../error/badRequestError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Input Validator Middleware");

export function validateReqQuery(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      next(new BadRequestError(error.message));
      return;
    }

    req.query = value;

    next();
  };
}

export function validateReqBody(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      next(new BadRequestError(error.message));
      return;
    }

    req.body = value;

    next();
  };
}

import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import loggerWithNameSpace from "../utils/logger";
import { SchemaError } from "../error/schemaError";

const logger = loggerWithNameSpace("Input Validator Middleware");

export function validateReqQuery(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info("Validating Schema");
    const { error, value } = schema.validate(req.query);

    if (error) {
      logger.error("Schema Invalid");
      next(new SchemaError(error.message));
      return;
    }
    logger.info("Schema Validated Successfully");
    req.query = value;

    next();
  };
}

export function validateReqBody(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info("Validating Schema");
    const { error, value } = schema.validate(req.body);

    if (error) {
      logger.error("Schema Invalid");
      next(new SchemaError(error.message));
      return;
    }
    logger.info("Schema Validated Successfully");
    req.body = value;

    next();
  };
}

import { NextFunction, Request, Response } from "express";
import {Schema} from "joi";
import { BadRequestError } from "../../error/badRequestError";

export function validateReqQuery(schema: Schema){
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.query);
        if(error){
            next(new BadRequestError(error.message));
        }
        req.query = value;
        next();
    }
}
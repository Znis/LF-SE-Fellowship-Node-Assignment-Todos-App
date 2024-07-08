import {Request, Response } from "express";
import * as UsersService from "../services/users";
import userSchema from "../schema/user";

export async function getUserId(req: Request, res: Response){
    const user = req.body;
    const {error, value} = userSchema.validate(user);
    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }
    const {responseMessage, responseCode} = await UsersService.getUserId(value);

    return res.status(responseCode).json(responseMessage);
}
export async function createUser(req: Request, res: Response){
    const data = req.body;
    const {error, value} = userSchema.validate(data);
    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }
    const {responseMessage, responseCode} = await UsersService.createUser(value);

    return res.status(responseCode).json(responseMessage);
}
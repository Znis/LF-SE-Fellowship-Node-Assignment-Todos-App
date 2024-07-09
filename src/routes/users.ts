import express from "express";
import { createUser, getUserByEmail } from "../controller/users";


const usersRouter = express();

usersRouter.post("/", getUserByEmail);

usersRouter.post("/register", createUser);


export default usersRouter;
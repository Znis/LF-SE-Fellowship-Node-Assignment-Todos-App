import { permissions } from './../enums/users';
import express from "express";
import { createUser, deleteUser, editUser, getUserByEmail } from "../controller/users";
import { authorize } from "../middleware/auth";
import { validateReqQuery } from '../middleware/validator';
import { userSchema } from '../schema/user';


const usersRouter = express();

usersRouter.post("/", validateReqQuery(userSchema), getUserByEmail);

usersRouter.post("/register", authorize(permissions.create_user),createUser);

usersRouter.delete("/delete/:id", authorize(permissions.delete_user),deleteUser);

usersRouter.put("/edit/:id", authorize(permissions.edit_user),editUser);


export default usersRouter;
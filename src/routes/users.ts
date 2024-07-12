import { createOrEditUserBodySchema } from "./../schema/user";
import { permissions } from "./../enums/users";
import express from "express";
import {
  createUser,
  deleteUser,
  editUser,
  getUserByEmail,
} from "../controller/users";
import { authorize } from "../middleware/auth";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import { editOrdeleteUserQuerySchema } from "../schema/user";

const usersRouter = express();

usersRouter.post("/", getUserByEmail);

usersRouter.post(
  "/register",
  authorize(permissions.create_user),
  validateReqQuery(editOrdeleteUserQuerySchema),
  validateReqBody(createOrEditUserBodySchema),
  createUser
);

usersRouter.put(
  "/edit/:id",
  authorize(permissions.edit_user),
  validateReqBody(createOrEditUserBodySchema),
  editUser
);

usersRouter.delete(
  "/delete/:id",
  authorize(permissions.delete_user),
  validateReqQuery(editOrdeleteUserQuerySchema),
  deleteUser
);
export default usersRouter;

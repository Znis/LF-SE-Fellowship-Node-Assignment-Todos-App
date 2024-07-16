import { createOrEditUserBodySchema } from "./../schema/user";
import { permissions } from "./../enums/users";
import express from "express";
import {
  createUser,
  deleteUser,
  editUser,
  getUserByEmail,
} from "../controller/users";
import { auth, authorize } from "../middleware/auth";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import { editOrdeleteUserQuerySchema } from "../schema/user";

const usersRouter = express();

usersRouter.post("/", auth, getUserByEmail);

usersRouter.post(
  "/register",
  validateReqBody(createOrEditUserBodySchema),
  auth,
  authorize(permissions.create_user),
  createUser
);

usersRouter.put(
  "/edit/",
  validateReqQuery(editOrdeleteUserQuerySchema),
  validateReqBody(createOrEditUserBodySchema),
  auth,
  authorize(permissions.edit_user),
  editUser
);

usersRouter.delete(
  "/delete/",
  validateReqQuery(editOrdeleteUserQuerySchema),
  auth,
  authorize(permissions.delete_user),
  deleteUser
);
export default usersRouter;

import express from "express";
import {
  createTodos,
  deleteTodos,
  getTodos,
  updateTodos,
} from "../controller/todos";
import { auth, authorize } from "../middleware/auth";
import { permissions } from "../enums/users";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import {
  createOrUpdateTodoBodySchema,
  getTodosSchema,
  updateOrDeleteTodoQuerySchema,
} from "../schema/todos";

const todosRouter = express();

todosRouter.post("/", validateReqQuery(getTodosSchema), auth, authorize(permissions.view_todo), getTodos);

todosRouter.post(
  "/create",
  validateReqBody(createOrUpdateTodoBodySchema),
  auth,
  authorize(permissions.create_todo),
  createTodos
);

todosRouter.put(
  "/update/",
  validateReqQuery(updateOrDeleteTodoQuerySchema),
  validateReqBody(createOrUpdateTodoBodySchema),
  auth,
  authorize(permissions.update_todo),
  updateTodos
);

todosRouter.delete(
  "/delete/",
  validateReqQuery(updateOrDeleteTodoQuerySchema),
  auth,
  authorize(permissions.delete_todo),
  deleteTodos
);

export default todosRouter;

import express from "express";
import {
  createTodos,
  deleteTodos,
  getTodos,
  updateTodos,
} from "../controller/todos";
import { authorize } from "../middleware/auth";
import { permissions } from "../enums/users";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import {
  createOrUpdateTodoBodySchema,
  updateOrdeleteTodoQuerySchema,
} from "../schema/todos";

const todosRouter = express();

todosRouter.post("/", authorize(permissions.view_todo), getTodos);

todosRouter.post(
  "/create",
  authorize(permissions.create_todo),
  validateReqBody(createOrUpdateTodoBodySchema),
  createTodos
);

todosRouter.put(
  "/update/:id",
  authorize(permissions.update_todo),
  validateReqQuery(updateOrdeleteTodoQuerySchema),
  validateReqBody(createOrUpdateTodoBodySchema),
  updateTodos
);

todosRouter.delete(
  "/delete/:id",
  authorize(permissions.delete_todo),
  validateReqQuery(updateOrdeleteTodoQuerySchema),
  deleteTodos
);

export default todosRouter;

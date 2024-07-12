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
  updateOrdeleteTodoQuerySchema,
} from "../schema/todos";

const todosRouter = express();

todosRouter.post("/", auth, authorize(permissions.view_todo), getTodos);

todosRouter.post(
  "/create",
  validateReqBody(createOrUpdateTodoBodySchema),
  auth,
  authorize(permissions.create_todo),
  createTodos
);

todosRouter.put(
  "/update/:id",
  validateReqQuery(updateOrdeleteTodoQuerySchema),
  validateReqBody(createOrUpdateTodoBodySchema),
  auth,
  authorize(permissions.update_todo),
  updateTodos
);

todosRouter.delete(
  "/delete/:id",
  validateReqQuery(updateOrdeleteTodoQuerySchema),
  auth,
  authorize(permissions.delete_todo),
  deleteTodos
);

export default todosRouter;

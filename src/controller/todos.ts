import { Request, Response } from "express";
import * as TodosService from "../services/todos";
import todosSchema from "../schema/todos";
import { decodeEncodedCreds } from "../utils/utils";
import { getUserId } from "../model/users";

export async function getTodos(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const encodedCredentials = authHeader.split(" ")[1];
    const user = decodeEncodedCreds(encodedCredentials);
    const userId = await getUserId(user);
    if (userId!.length > 0) {
      const data = await TodosService.getTodos(userId![0].id);
      return res.status(201).json(data);
    } else {
      return res.status(401).json("Invalid Authentication");
    }
  } else {
    return res.status(401).json("Requires Authentication");
  }
}
export async function createTodos(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const encodedCredentials = authHeader.split(" ")[1];
    const user = decodeEncodedCreds(encodedCredentials);
    const userId = await getUserId(user);
    if (userId!.length > 0) {
      const data = req.body;
      const { error, value } = todosSchema.validate(data);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { responseMessage, responseCode } = await TodosService.createTodos(
        userId![0].id,
        value
      );
      return res.status(responseCode).json(responseMessage);
    } else {
      return res.status(401).json("Invalid Authentication");
    }
  } else {
    return res.status(401).json("Requires Authentication");
  }
}
export async function updateTodos(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const encodedCredentials = authHeader.split(" ")[1];
    const user = decodeEncodedCreds(encodedCredentials);
    const userId = await getUserId(user);
    if (userId!.length > 0) {
      const { id } = req.params;
      const data = req.body;
      const { error, value } = todosSchema.validate(data);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { responseMessage, responseCode } = await TodosService.updateTodos(
        userId![0].id,
        id,
        value
      );
      return res.status(responseCode).json(responseMessage);
    } else {
      return res.status(401).json("Invalid Authentication");
    }
  } else {
    return res.status(401).json("Requires Authentication");
  }
}
export async function deleteTodos(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const encodedCredentials = authHeader.split(" ")[1];
    const user = decodeEncodedCreds(encodedCredentials);
    const userId = await getUserId(user);
    if (userId!.length > 0) {
      const { id } = req.params;
      const { responseMessage, responseCode } = await TodosService.deleteTodos(
        userId![0].id,
        id
      );
      return res.status(responseCode).json(responseMessage);
    } else {
      return res.status(401).json("Invalid Authentication");
    }
  } else {
    return res.status(401).json("Requires Authentication");
  }
}

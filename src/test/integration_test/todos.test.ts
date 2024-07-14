import request from "supertest";

import express from "express";
import router from "../../routes";
import expect from "expect";
import {
  genericErrorHandler,
  notFoundError,
} from "../../middleware/errorHandler";

describe("Todos Integration Test Suite", () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  app.use(genericErrorHandler);
  app.use(notFoundError);
  let todo = {
    title: "dummyxyz",
    description: "dummydummy",
    dueDate: "2001-01-01",
    completed: false,
    priority: "Medium",
    category: "Sports",
  };
  describe("getTodos API Test", () => {
    let accessToken;

    beforeEach(async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "admin@admin.com", password: "Admin$" });
      accessToken = response.body.accessToken;
    });

    it("Should return the todos of the user", async () => {
      const response = await request(app)
        .post("/todos/")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");

      expect(response.body).toStrictEqual([]);
    });
  });
  describe("createTodo API Test", () => {
    let accessToken;

    beforeEach(async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "admin@admin.com", password: "Admin$" });
      accessToken = response.body.accessToken;
    });
    afterEach(async () => {
      const todos = await request(app)
        .post("/todos/")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");
      const todo = todos.body.find((todo) => todo.title === "dummyxyz");
      await request(app)
        .delete(`/todos/delete/${todo.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");
    });

    it("Should create new todo", async () => {
      const response = await request(app)
        .post("/todos/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send(todo);

      expect(response.body.created.title).toBe("dummyxyz");
    });
  });
  describe("editTodos API Test", () => {
    let accessToken;
    let id;

    beforeEach(async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "admin@admin.com", password: "Admin$" });
      accessToken = response.body.accessToken;
      await request(app)
        .post("/todos/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send(todo);
      const todos = await request(app)
        .post("/todos/")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");
      id = todos.body.find((todo) => todo.title === "dummyxyz").id;
    });
    afterEach(async () => {
      await request(app)
        .delete(`/todos/delete/${id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");
    });

    it("Should edit the todo", async () => {
      const response = await request(app)
        .put(`/todos/update/${id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send({ ...todo, title: "abcDummy" });

      expect(response.body.updated.title).toBe("abcDummy");
    });
  });
  describe("deleteTodos API Test", () => {
    let accessToken;
    let id;

    beforeEach(async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "admin@admin.com", password: "Admin$" });
      accessToken = response.body.accessToken;
      await request(app)
        .post("/todos/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send(todo);
      const todos = await request(app)
        .post("/todos/")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");
      id = todos.body.find((todo) => todo.title === "dummyxyz").id;
    });

    it("Should delete the user", async () => {
      const response = await request(app)
        .delete(`/todos/delete/${id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");

      expect(response.body).toStrictEqual({});
    });
  });
});

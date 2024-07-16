import request from "supertest";

import express from "express";
import router from "../../routes";
import expect from "expect";
import {
  genericErrorHandler,
  notFoundError,
} from "../../middleware/errorHandler";

describe("User Integration Test Suite", () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  app.use(genericErrorHandler);
  app.use(notFoundError);

  let user = {
    name: "yo",
    email: "yolo@yolo.com",
    password: "Yoo$",
  };
  describe("getUserByEmail API Test", () => {
    let accessToken;

    beforeEach(async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "admin@admin.com", password: "Admin$" });
      accessToken = response.body.accessToken;
    });

    it("Should return the admin name", async () => {
      const response = await request(app)
        .post("/users/")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send({ email: "admin@admin.com" });

      expect(response.body.name).toBe("admin");
    });
  });
  describe("createUser API Test", () => {
    let accessToken;

    beforeEach(async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "admin@admin.com", password: "Admin$" });
      accessToken = response.body.accessToken;
    });
    afterEach(async () => {
      const id = await request(app)
        .post("/users/")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send({ email: "yolo@yolo.com" });

      await request(app)
        .delete(`/users/delete/?id=${id.body.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");
    });

    it("Should create new user", async () => {
      const response = await request(app)
        .post("/users/register")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send(user);

      expect(response.body.created.email).toBe("yolo@yolo.com");
    });
  });
  describe("editUser API Test", () => {
    let accessToken;
    let id;

    beforeEach(async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "admin@admin.com", password: "Admin$" });
      accessToken = response.body.accessToken;
      await request(app)
        .post("/users/register")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send(user);
      id = await request(app)
        .post("/users/")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send({ email: "yolo@yolo.com" });
    });
    afterEach(async () => {
      await request(app)
        .delete(`/users/delete/?id=${id.body.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");
    });

    it("Should edit the user", async () => {
      const response = await request(app)
        .put(`/users/edit/?id=${id.body.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send({ ...user, name: "YOLO" });

      expect(response.body.edited.name).toBe("YOLO");
    });
  });
  describe("deleteUser API Test", () => {
    let accessToken;
    let id;

    beforeEach(async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "admin@admin.com", password: "Admin$" });
      accessToken = response.body.accessToken;
      await request(app)
        .post("/users/register")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send(user);
      id = await request(app)
        .post("/users/")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send({ email: "yolo@yolo.com" });
    });

    it("Should delete the user", async () => {
      const response = await request(app)
        .delete(`/users/delete/?id=${id.body.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json");

      expect(response.body).toStrictEqual({});
    });
  });
});

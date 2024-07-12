import request from "supertest";

import express from "express";
import router from "../../routes";

describe("User Integration Test Suite", () => {
  const app = express();
  app.use(router);

  describe("createUser API Test", () => {
    it("Should create new user", async () => {
        const response = await request(app).post("/users").send({
            name: "yo",
            email: "yolo@yolo.com",
            password: "Yoo$",
          });
    });

  });
});

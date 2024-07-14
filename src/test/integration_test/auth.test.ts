import request from "supertest";

import express from "express";
import router from "../../routes";
import expect from "expect";
import {
  genericErrorHandler,
  notFoundError,
} from "../../middleware/errorHandler";

describe("Auth Integration Test Suite", () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  app.use(genericErrorHandler);
  app.use(notFoundError);
  let userCreds = {
    email: "admin@admin.com",
    password: "Admin$",
  };

  describe("login API Test", () => {
    it("Should return the access token and refresh token if login is successful", async () => {
      const response = await request(app).post("/auth/login").send(userCreds);

      expect(response.body.accessToken).toBeTruthy;
      expect(response.body.refreshToken).toBeTruthy;
      expect(response.status).toBe(200);
    });
  });
  describe("refresh API Test", () => {
    let accessToken;
    let refreshToken;

    beforeEach(async () => {
      const response = await request(app).post("/auth/login").send(userCreds);
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it("Should return the new accessToken", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .set("Authorization", `Bearer ${refreshToken}`);

      expect(response.body).toBeTruthy;
      expect(response.status).toBe(200);
    });
  });
});

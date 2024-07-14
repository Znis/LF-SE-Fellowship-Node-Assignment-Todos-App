import sinon from "sinon";
import expect from "expect";
import * as AuthController from "../../../controller/auth";
import * as AuthServices from "../../../services/auth";

describe("Auth Controller Test Suite", () => {
  describe("login", () => {
    let authServiceLoginStub;
    let req, res, next;
    beforeEach(() => {
      req = {
        body: { email: "test@example.com", password: "password" },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
      authServiceLoginStub = sinon.stub(AuthServices, "login");
    });
    afterEach(() => {
      sinon.restore();
    });
    it("should not call the next function if the login is successful", async () => {
      const authResponse = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      };
      authServiceLoginStub.resolves(authResponse);

      await AuthController.login(req, res, next);
      expect(next.called).toBe(false);
    });
    it("should call the next function if the login is successful", async () => {
      authServiceLoginStub.rejects(new Error("Login Failed"));

      await AuthController.login(req, res, next);
      expect(next.called).toBe(true);
    });
  });
  describe("refresh", () => {
    let authServiceRefreshStub;
    let req, res, next;
    beforeEach(() => {
      req = {
        headers: { authorization: "Bearer refreshToken" },
        body: { email: "test@example.com", password: "password" },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      next = sinon.stub();
      authServiceRefreshStub = sinon.stub(AuthServices, "refresh");
    });
    afterEach(() => {
      sinon.restore();
    });
    it("should not call the next function if the access token refresh is successful", async () => {
      const authResponse = "accessToken";
      authServiceRefreshStub.resolves(authResponse);

      await AuthController.refresh(req, res, next);
      expect(next.called).toBe(false);
    });
    it("should not call the next function if the access token refresh is successful", async () => {
      authServiceRefreshStub.rejects(new Error("Refresh Failed"));

      await AuthController.refresh(req, res, next);
      expect(next.called).toBe(true);
    });
  });
});

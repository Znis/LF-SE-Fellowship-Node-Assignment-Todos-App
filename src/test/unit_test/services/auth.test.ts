import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as AuthService from "../../../services/auth";
import expect from "expect";
import sinon from "sinon";
import Iuser from "../../../interfaces/user";

describe("Auth Service Test Suite", () => {
  const userServices = AuthService.userServices;
  describe("login", () => {
    let userServicesGetUserByEmailStub;
    let bcryptCompareStub;
    let signStub;

    const user: Iuser = {
      name: "dummy",
      email: "dummy@dummy.com",
      password: "hashedPassword",
    };

    beforeEach(() => {
      userServicesGetUserByEmailStub = sinon.stub(
        userServices,
        "getUserByEmail"
      );
      bcryptCompareStub = sinon.stub(bcrypt, "compare");
      signStub = sinon.stub(jwt, "sign");
    });
    afterEach(() => {
      sinon.restore();
    });

    it("should return the access token and refresh token on successful login", async () => {
      userServicesGetUserByEmailStub.resolves(user);
      bcryptCompareStub.resolves(true);
      signStub.onFirstCall().returns("accessToken");
      signStub.onSecondCall().returns("refreshToken");

      const result = await AuthService.login(user);
      expect(result).toStrictEqual({
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      });
    });
    it("should throw an error if user does not exist", async () => {
      userServicesGetUserByEmailStub.resolves(null);

      try {
        await AuthService.login(user);
        throw new Error("Expected method to throw");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid Credentials");
      }
    });
    it("should throw an error if password is not valid", async () => {
      userServicesGetUserByEmailStub.resolves(user);
      bcryptCompareStub.resolves(false);

      try {
        await AuthService.login(user);
        throw new Error("Expected method to throw");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid Credentials");
      }
    });
  });
  describe("refresh", () => {
    let verifyStub;
    let signStub;

    const user: Iuser = {
      name: "dummy",
      email: "dummy@dummy.com",
      password: "hashedPassword",
    };

    beforeEach(() => {
      verifyStub = sinon.stub(jwt, "verify");
      signStub = sinon.stub(jwt, "sign");
    });
    afterEach(() => {
      verifyStub.restore();
      signStub.restore();
    });

    it("should return the access token if refresh token is valid", async () => {
      verifyStub.resolves(user);
      signStub.resolves("accessToken");
      const authHeader = "Bearer refreshToken";

      const result = await AuthService.refresh(authHeader);
      expect(result).toStrictEqual("accessToken");
    });
    it("should throw an error if authorization header does not exist", async () => {
      const authHeader = undefined;

      try {
        await AuthService.refresh(authHeader);
        throw new Error("Expected method to throw");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("No Authorization Headers");
      }
    });
    it("should throw an error if refresh token does not exist", async () => {
      const authHeader = "invalid token";

      try {
        await AuthService.refresh(authHeader);
        throw new Error("Expected method to throw");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("No Bearer Token");
      }
    });
    // it("should throw an error if refresh token is not valid", async () => {
    //   verifyStub.resolves(undefined);

    //   const authHeader = "Bearer refreshToken";
    //   try {
    //     await AuthService.refresh(authHeader);
    //     throw new Error("Expected method to throw");
    //   } catch (err) {
    //     expect(err).toBeInstanceOf(Error);
    //     expect(err.message).toBe("Invalid Token");
    //   }
    // });
  });
  //   describe("getAssignedPermission", () => {
  //     let userServicesGetAssignedPermissionStub;

  //     beforeEach(() => {
  //         userServicesGetAssignedPermissionStub = sinon.stub(
  //         userServices,
  //         "getAssignedPermission"
  //       );
  //     });
  //     afterEach(() => {
  //       sinon.restore();
  //     });

  //     it("should return permissions", async () => {
  //         userServicesGetAssignedPermissionStub.resolves(["permission1", "permission2"]);
  //         const userId = "1";
  //       const result = await AuthService.getAssignedPermission(userId);
  //       expect(result).toBe(["permission1", "permission2"]);

  //   });
  // });
});

import bcrypt from "bcrypt";
import { expect } from "expect";
import sinon from "sinon";
import * as UserModel from "../../../model/users";
import * as UserService from "../../../services/users";
import Iuser from "../../../interfaces/user";


describe("User Service Test Suite", () => {
  describe("getUserByEmail", () => {
    let userModelGetUserByEmailStub: sinon.SinonStub;
    beforeEach(() => {
      userModelGetUserByEmailStub = sinon.stub(UserModel, "getUserByEmail");
    });
    afterEach(() => {
      userModelGetUserByEmailStub.restore();
    });

    it("Should return user when found", () => {
      userModelGetUserByEmailStub.resolves({
        id: "1",
        name: "dummy",
        email: "dummy@dummy.com",
        password: "hashedPassword",
      });
      expect(UserService.getUserByEmail("dummy@dummy.com")).resolves.toBe({
        id: "1",
        name: "dummy",
        email: "dummy@dummy.com",
        password: "hashedPassword",
      });
    });

    // it("Should return user if user is found", () => {
    //     const user = {
    //         id: "1",
    //         name: "admin",
    //         email: "admin@admin.com",
    //         password: "admin",
    //     }
    //     userModelGetUserByEmailStub.resolves(user);
    //     const response = getUserByEmail("abc");
    //     expect(response).toStrictEqual(user);
    // });
  });

  describe("createUser", () => {
    let bcryptHashStub: sinon.SinonStub;
    let userModelCreateUserStub: sinon.SinonStub;
    let getUserByEmailStub: sinon.SinonStub;
    let assignRoleStub: sinon.SinonStub;
    let user: Iuser = {
        id: "1",
        name: "dummy",
        email: "dummy@dummy.com",
        password: "dummy",
      };

    beforeEach(() => {
        bcryptHashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword");
        userModelCreateUserStub = sinon.stub(UserModel, "createUser").resolves({
          modelResponseCode: 200,
          queryResult: {...user, password:"hashedPassword"},
        });

        getUserByEmailStub = sinon
          .stub(UserService,"getUserByEmail")
          .resolves({...user, password:"hashedPassword"});


        assignRoleStub = sinon.stub(UserService, "assignRole").resolves();
    });

    afterEach(() =>{
        bcryptHashStub.restore();
        userModelCreateUserStub.restore();
        getUserByEmailStub.restore();
        assignRoleStub.restore();
    })

    it("Should create new user", async () => {

      expect(bcryptHashStub.calledWith(user.password, sinon.match.any)).toBe(
        true
      );
    //   expect(userModelCreateUserStub.calledOnceWith(user)).toBe(true);
    //   expect(getUserByEmailStub.calledOnceWith(user.email)).toBe(true);


      const result = await UserService.createUser(user);
      expect(result).toBe({...user, password:"hashedPassword"});

    });
  });
});

// describe.only("example", () => {
//     before(() => { //beforeEach, afterEach, after, it(each test case)
//         console.log("before")
//     })
// expect(bcryptHashStub.callCount).toBe(1);
// expect(bcryptHashStub.getCall(0).args).toStrictEqual([user.password, 10]);

// expect(userModelCreateUserStub.callCount).toBe(1);
// expect(userModelCreateUserStub.getCall(0).args).toStrictEqual([{...user, password: "hashedPassword"}]);
// })

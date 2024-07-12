import bcrypt  from 'bcrypt';
import { expect } from 'expect';
import { createUser, getUserByEmail } from '../../../services/users';
import sinon from 'sinon';
import UserModel from "../../../model/users";

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
            userModelGetUserByEmailStub.resolves(
                {   
                    id: "1",
                    name: "dummy",
                    email:"dummy@dummy.com",
                    password: "hashedPassword"
                    
                }
            );
            expect(() => getUserByEmail("dummy@dummy.com")).toBe(
                {
                    id: "1",
                    name: "dummy",
                    email:"dummy@dummy.com",
                    password: "hashedPassword"
                }
            );
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
    
    // describe("createUser", () => {
    //     let bcryptHashStub: sinon.SinonStub;
    //     let userModelCreateUserStub: sinon.SinonStub;
    
    //     beforeEach(() => {
    //         bcryptHashStub = sinon.stub(bcrypt, "hash");
    //         userModelCreateUserStub = sinon.stub(UserModel, "createUser");
    //     });
    //     afterEach(() => {
    //         bcryptHashStub.restore();
    //         userModelCreateUserStub.restore();
    //     })
    //     it("Should create new user", async () => {
    //         const user = {
    //             id: "1",
    //             name: "admin",
    //             email: "admin@admin.com",
    //             password: "admin",
    //         } as Iuser
    //         await createUser(user);
    //         expect(bcryptHashStub.callCount).toBe(1);
    //         expect(bcryptHashStub.getCall(0).args).toStrictEqual([user.password, 10]);

    //         expect(userModelCreateUserStub.callCount).toBe(1);
    //         expect(userModelCreateUserStub.getCall(0).args).toStrictEqual([{...user, password: "hashedPassword"}]);

    //     });
    // });
    
});







// describe.only("example", () => {
//     before(() => { //beforeEach, afterEach, after, it(each test case)
//         console.log("before")
//     })
// })
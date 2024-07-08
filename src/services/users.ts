import Iuser from "../interfaces/user";
import * as UserModel from "../model/users";


export async function getUserId(user: Iuser){
const data = await UserModel.getUserId(user);
if(data!.length > 0){
    const modelResponse = {
        responseCode: 200,
        responseMessage: "Auth Successful"
    }
    return modelResponse;
}else{
    const modelResponse = {
        responseCode: 401,
        responseMessage: "Auth Failed"
    }
    return modelResponse;
}
}

export async function createUser(user: Iuser){
    const modelResponseCode = await UserModel.createUser(user);
    const modelResponse = {
        responseCode: modelResponseCode,
        responseMessage: modelResponseCode == 200 ? "Creation Successful" : "Creation Failed"
    }
    return modelResponse;
}
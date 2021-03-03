
import { UserAccess } from '../dataLayer/userAccess'
import { RegisterRequest } from '../requests/RegisterRequest'
import { LoginRequest } from '../requests/LoginRequest'
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';


const userAccess = new UserAccess()


export async function login(user: LoginRequest): Promise<string> {
    
    const {username, password} = user;
    const {hash} = await userAccess.getUserbyUsername(username);
    
    const authValid = await bcrypt.compare(password, hash)

    if(!authValid) {
        return ''
    }

    //TODO update secret
    const JWT = generateJWT(username)
    return JWT
}

export async function register(
    user: RegisterRequest,    
): Promise<string> {
    const {username, password, email} = user

    const salt =  await bcrypt.genSalt(10);
    const hash = await  bcrypt.hash(password, salt);

    const userCheck = await userAccess.getUserbyUsername(username);
    const emailCheck = await userAccess.getUserbyUsername(email);
    
    console.log(userCheck)
    console.log(emailCheck)

    if (userCheck || emailCheck){
        throw new UserError("User is already registered")    
    }


    const newUser = {
        email: email,
        username:username,
        salt: salt,
        hash : hash 
    }
    
    await userAccess.createUser(newUser) 
    const JWT = generateJWT(username)
    return JWT

}

class UserError extends Error {
    constructor(args){
        super(args);
        this.name = "UserExistError"
    }
  }
  
  

async function generateJWT(username){
    const JWT = jwt.sign({username:username}, 'thisisnotagoodsecret')
    return JWT
}



import { UserAccess } from '../dataLayer/userAccess'
import { RegisterRequest } from '../requests/RegisterRequest'
import { LoginRequest } from '../requests/LoginRequest'
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { createLogger } from '../utils/logger';

const logger = createLogger('User business login')

const userAccess = new UserAccess()


export async function login(user: LoginRequest): Promise<string> {
    
    const {username, password} = user;
    logger.info('Finding user', {username})
    const {hash} = await userAccess.getUserbyUsername(username);
    if (hash){
        console.log('Found user')
    }
    const authValid = await bcrypt.compare(password, hash)
    if(!authValid) {
        return ''
    }
    const JWT = generateJWT(username)
    return JWT
}

export async function register(
    user: RegisterRequest,    
): Promise<string> {
    const {username, password, email} = user
    logger.info('Registering user', {username})
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


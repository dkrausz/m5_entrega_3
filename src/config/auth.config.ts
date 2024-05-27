import { AppError } from "../errors/appError";

export const jwtConfig=()=>{
    const secret = process.env.JWT_SECRET_KEY;
    const expiresIn = process.env.EXPIRES_IN;

    if(!secret){
        throw new Error("Missing JWT enviroment variable 'JWT_SECRET_KEY'");
    }

    return {secret, expiresIn};
}
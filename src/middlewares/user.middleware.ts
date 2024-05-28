import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/appError";
import { jwtConfig } from "../config/auth.config";
import { verify } from "jsonwebtoken";

class UserMiddleware {
  public userExist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("User not registered", 404);
    }

    return next();
  };

  public isEmailUnique = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;

    const existEmail = await prisma.user.findUnique({ where: { email } });
    if (existEmail) {
      throw new AppError("E-mail already registered", 409);
    }

    return next();
  };

  public isAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    console.log("auth", authorization);
    
    if (!authorization) {
      throw new AppError("Token is required", 401);
    }
    const [_, token] = authorization.split(" ");
    const { secret } = jwtConfig();

    const jwtPayload = verify(token, secret);
    res.locals = { ...res.locals, decoded: jwtPayload };

    return next();
  };

  public isUserOwner=async(req:Request, res:Response,next:NextFunction)=>{
    const {userId} = req.body;
    const {id} = res.locals.decoded;   
    if(userId!==id){
      throw new AppError("User must be the car owner",403);
    }    
        return next();
};

public isUserOwnerOfThisCar = async(req:Request,res:Response, next:NextFunction)=>{
  const {id} = res.locals.decoded;  
  const userId = res.locals.car.userId;
  if(id!==userId){
    throw new AppError("User must be the car owner",403);
  }
  return next();
  
};

}

export const userMiddleware = new UserMiddleware();

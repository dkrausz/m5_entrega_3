import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/appError";

class EnsureMiddleeare{

public bodyIsValid =(schema:ZodSchema)=>
     (req :Request, res:Response, next: NextFunction):void=>{
        req.body=schema.parse(req.body);       
         return next();    
}

public carExist = async(req:Request,res:Response,next:NextFunction)=>{
 const {id}=req.params;
//  if(!id){
//     throw new AppError("Car not found.",404);
//  }
 const car = await prisma.car.findFirst({where:{id}});
 if(!car){
    throw new AppError("Car not found.",404);
 }
 return next();
}

}

export const ensureMiddleware = new EnsureMiddleeare();
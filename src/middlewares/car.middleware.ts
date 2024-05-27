import { Response, Request, NextFunction } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/appError";


class CarMiddleware{
    public carExist = async(req:Request,res:Response,next:NextFunction)=>{
        const {id}=req.params;
       
        const car = await prisma.car.findFirst({where:{id}});
        if(!car){
           throw new AppError("Car not found.",404);
        }
        res.locals.car=car;
        return next();
       };

       public validQuery = async(req:Request,res:Response,next:NextFunction)=>{
        if(req.query.userid){        
            res.locals.userid=req.query.userid;
        }
                   
        return next();
        
    }      

}

export const carMiddleware = new CarMiddleware();
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/appError";

class HandleErrorsMiddleware{

    public static execute=(error:Error,req:Request, res:Response,next:NextFunction)=>{
        if(error instanceof ZodError){
            return res.status(400).json({error:error.errors});
        }
        if(error instanceof AppError){
            return res.status(error.statusCode).json({message: error.message});
        }

        return res.status(500).json({message: "internal server error" });
    }
}

export const handleErrors = HandleErrorsMiddleware.execute;
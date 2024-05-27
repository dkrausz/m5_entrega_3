import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";


class EnsureMiddleeare{

public bodyIsValid =(schema:ZodSchema)=>
     (req :Request, res:Response, next: NextFunction):void=>{      
      
        req.body=schema.parse(req.body);       
         return next();    
};


}

export const ensureMiddleware = new EnsureMiddleeare();
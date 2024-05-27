import { inject, injectable } from "tsyringe";
import { IUserService } from "../interfaces";
import { Request, Response } from "express";



@injectable()
export class UserController{
    constructor(@inject("UserService") private userService: IUserService){}

    public createUser = async(req:Request, res:Response):Promise<Response>=>{
        const newUser = await this.userService.create(req.body);
                
        return res.status(201).json(newUser);
    };

    public login = async(req:Request, res:Response):Promise<Response>=>{
        const {email,password} =req.body;               
        
        const login = await this.userService.login(email,password);
        return res.status(200).json(login);
    }

    public getUser = async(req:Request, res:Response)=>{
        const {id}= res.locals.decoded;
        const user = await this.userService.getUser(id);
        return res.status(200).json(user);
    };

        


}
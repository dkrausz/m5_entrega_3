import {z} from "zod";
import { createUserBodySchema, returnLoginSchema, returnUserBody, userSchema } from "../schemas";

type TUser = z.infer<typeof userSchema>;
type TCreateUserbody = z.infer<typeof createUserBodySchema>;
type TreturnUserBody = z.infer<typeof returnUserBody>;
type TReturnLogin = z.infer<typeof returnLoginSchema>;

interface IUserService{
    create(payload:TCreateUserbody):Promise<TreturnUserBody>;
    login(email:string,password:string):Promise<TReturnLogin>;
    getUser(id:string):Promise<TreturnUserBody>;

}

export{TUser, TCreateUserbody, IUserService,TreturnUserBody,TReturnLogin};
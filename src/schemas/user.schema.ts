import {z} from "zod";
import { carScherma } from "./car.schema";


const userSchema = z.object({
    id:z.string().min(1),
    name:z.string().min(1),
    email:z.string().email().min(1),
    password:z.string().min(8),
    car:z.array(carScherma)
});

const createUserBodySchema = userSchema.omit({id:true,car:true});
const returnUserBody = userSchema.omit({password:true}).partial({car:true});
const loginSchema = userSchema.pick({email:true, password:true});

const returnLoginSchema = z.object({
    token: z.string().min(5),
    user:returnUserBody
});

export {userSchema,createUserBodySchema,returnUserBody,returnLoginSchema,loginSchema};
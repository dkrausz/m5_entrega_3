import {z} from "zod";
import { carScherma, createCarBodySchema, updateCarBodySchema } from "../schemas/car.schema";

type TCreateCarBody = z.infer<typeof createCarBodySchema>;
type TCar = z.infer<typeof carScherma>;
type TUpdateCarBody = z.infer<typeof updateCarBodySchema>;

interface ICarService{
    create(payload:TCreateCarBody):Promise<TCar>;
    getCars(userid?:string):Promise<Array<TCar>>;
    getOneCar(id:string):Promise<TCar>;
    updateCar(id:string, payload:TUpdateCarBody):Promise<TCar>;
    deleteCar(id:string):void;
}



export {TCreateCarBody, ICarService,TCar,TUpdateCarBody};
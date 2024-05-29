import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import {
  ICarService,
  TCar,
  TCreateCarBody,
  TUpdateCarBody,
} from "../interfaces/car.interface";
import { carScherma, createCarBodySchema } from "../schemas";

@injectable()
export class CarService implements ICarService {
  public create = async (payload: TCreateCarBody): Promise<TCar> => {
    const newCar = await prisma.car.create({ data: payload });
    return carScherma.parse(newCar);
  };

  public getCars = async (userid?:string): Promise<Array<TCar>> => {
    let cars;    
    
    if(userid){             
      cars = await prisma.car.findMany({where:{userId:userid}});

    }else{     
      
      cars= await prisma.car.findMany();
    }
    
    return carScherma.array().parse(cars);
  };

  public getOneCar = async (id: string): Promise<TCar> => {
    const cars = await prisma.car.findFirst({ where: { id } });
    return carScherma.parse(cars);
  };

  public updateCar = async (
    id: string,
    payload: TUpdateCarBody
  ): Promise<TCar> => {
    const updatedCar = await prisma.car.update({
      where: { id },
      data: payload,
    });

    return carScherma.parse(updatedCar);
  };

  public deleteCar = async (id: string) => {
    return await prisma.car.delete({ where: { id } });
  };
}

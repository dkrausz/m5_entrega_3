import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CarService } from "../service/car.service";
import { ICarService } from "../interfaces/car.interface";


@injectable()
export class CarController{

    constructor(@inject("CarService") private carService: ICarService){};

    public createCar = async (req:Request, res: Response):Promise<Response>=>{       
                
        const newCar = await this.carService.create(req.body);        
        
        return res.status(201).json(newCar);
    };

    public getCars = async(req:Request, res:Response):Promise<Response>=>{
        const cars = await this.carService.getCars();
        return res.status(200).json(cars);
    }

    public getOneCar = async(req:Request, res:Response):Promise<Response>=>{
        const {id} = req.params;
        const cars = await this.carService.getOneCar(id);
        return res.status(200).json(cars);
    }

    public updateCar = async(req:Request, res:Response):Promise<Response>=>{
        const {id} = req.params;
        const updateBody = req.body;
        const updatedCar= await this.carService.updateCar(id,updateBody);
        return res.status(200).json(updatedCar);
    }

    public deleteCar = async(req:Request, res:Response):Promise<Response>=>{
        const {id}=req.params;
        await this.carService.deleteCar(id);
        return res.status(204).json("");
    }

}
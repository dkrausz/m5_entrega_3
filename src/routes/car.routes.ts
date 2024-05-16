import { Router } from "express";
import { ensureMiddleware } from "../middlewares/ensureMiddleware";
import { createCarBodySchema, updateCarBodySchema } from "../schemas/car.schema";
import { container } from "tsyringe";
import { CarService } from "../service/car.service";
import { CarController } from "../controller/car.controller";


export const carRoute = Router();
// Rotas
container.registerSingleton("CarService",CarService);
const carController = container.resolve(CarController);

carRoute.post("",ensureMiddleware.bodyIsValid(createCarBodySchema),carController.createCar);
carRoute.get("",carController.getCars);
carRoute.get("/:id",ensureMiddleware.carExist,carController.getOneCar);
carRoute.patch("/:id",ensureMiddleware.carExist,ensureMiddleware.bodyIsValid(updateCarBodySchema),carController.updateCar);
carRoute.delete("/:id",ensureMiddleware.carExist,carController.deleteCar);

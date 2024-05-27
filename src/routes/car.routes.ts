import { Router } from "express";
import { ensureMiddleware } from "../middlewares/ensureMiddleware";
import { createCarBodySchema, updateCarBodySchema } from "../schemas";
import { container } from "tsyringe";
import { CarService } from "../service/car.service";
import { CarController } from "../controller/car.controller";
import { carMiddleware } from "../middlewares/car.middleware";
import { userMiddleware } from "../middlewares/user.middleware";


export const carRoute = Router();
// Rotas
container.registerSingleton("CarService",CarService);
const carController = container.resolve(CarController);

carRoute.post("",userMiddleware.isAuth,ensureMiddleware.bodyIsValid(createCarBodySchema),userMiddleware.isUserOwner,carController.createCar);
carRoute.get("",carMiddleware.validQuery,carController.getCars);
carRoute.get("/:id",carMiddleware.carExist,carController.getOneCar);
carRoute.patch("/:id",userMiddleware.isAuth,carMiddleware.carExist,ensureMiddleware.bodyIsValid(updateCarBodySchema),userMiddleware.isUserOwnerOfThisCar,carController.updateCar);
carRoute.delete("/:id",userMiddleware.isAuth,carMiddleware.carExist,userMiddleware.isUserOwnerOfThisCar,carController.deleteCar);

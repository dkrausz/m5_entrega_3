import { Router } from "express";
import { ensureMiddleware } from "../middlewares/ensureMiddleware";
import { container } from "tsyringe";
import { createUserBodySchema, loginSchema } from "../schemas";
import { UserService } from "../service/user.service";
import { UserController } from "../controller/user.controller";
import { userMiddleware } from "../middlewares/user.middleware";


export const userRoute = Router();
// Rotas
container.registerSingleton("UserService",UserService);
const userController = container.resolve(UserController);

userRoute.post("",ensureMiddleware.bodyIsValid(createUserBodySchema),userMiddleware.isEmailUnique,userController.createUser);
userRoute.post("/login",ensureMiddleware.bodyIsValid(loginSchema),userMiddleware.userExist,userController.login);
userRoute.get("",userMiddleware.isAuth,userController.getUser);



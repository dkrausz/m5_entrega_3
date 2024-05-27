import { injectable } from "tsyringe";
import {
  IUserService,
  TCreateUserbody,
  TReturnLogin,
  TreturnUserBody,
} from "../interfaces";
import { prisma } from "../database/prisma";
import { returnLoginSchema, returnUserBody } from "../schemas";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { jwtConfig } from "../config/auth.config";
import { AppError } from "../errors/appError";

@injectable()
export class UserService implements IUserService {
  public create = async (
    payload: TCreateUserbody): Promise<TreturnUserBody> => {
    payload.password = await hash(payload.password, 10);
    const newUser = await prisma.user.create({ data: payload });

    return returnUserBody.parse(newUser);
  };

  public login = async (email: string,password: string): Promise<TReturnLogin> => {
    const { secret, expiresIn } = jwtConfig();
    const user = await prisma.user.findUnique({ where: { email } });

    const checkPassword = await compare(password, user!.password);

    if (!checkPassword) {
      throw new AppError("E-mail and password doesn't match", 401);
    }

    const token = sign({ id: user!.id }, secret, {
      expiresIn: expiresIn,
      subject: user!.id.toString(),
    });

    const returnLogin = { token, user };

    return returnLoginSchema.parse(returnLogin);
  };

  public getUser = async(id:string):Promise<TreturnUserBody>=>{
    const user = await prisma.user.findUnique({where:{id}});
    return returnUserBody.parse(user);

  };

}

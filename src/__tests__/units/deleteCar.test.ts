import "reflect-metadata";
import { carMock1 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";
import { userMock1 } from "../__mocks__/user.mock";

const carSerice = container.resolve(CarService);

describe("Unit test: Delete a Car", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
        await prisma.user.deleteMany();
    });

    test("Should be able to delete a car successfully",async()=>{
        const newUser = await prisma.user.create({data:userMock1});
        const carTest = {...carMock1,userId:newUser.id};
        const newCar = await prisma.car.create({data:carTest});
    
        await carSerice.deleteCar(newCar.id);
      
        const carList = await prisma.car.findMany();

        expect(carList.length).toBe(0);
    });

});

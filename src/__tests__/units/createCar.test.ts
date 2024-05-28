import "reflect-metadata";
import { carMock1 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";
import { userMock1 } from "../__mocks__/user.mock";

const carService = container.resolve(CarService);

describe("Unit test: Create a car", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
        await prisma.user.deleteMany();
    });


    test("Should be able to create a car successfully",async()=>{
        const newUser = await prisma.user.create({data:userMock1});
        const carTest = {...carMock1,userId:newUser.id};

        const newCar = await carService.create(carTest);

        const expectedValue={
            id:expect.any(String),
            name:carMock1.name,
            description:carMock1.description,
            brand: carMock1.brand,
            year:carMock1.year,
            km:carMock1.km ,
            userId:newUser.id           
        };

        expect(newCar).toEqual(expectedValue);
    });

});

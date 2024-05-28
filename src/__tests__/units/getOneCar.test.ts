import "reflect-metadata";
import { carMock1 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";
import { userMock1 } from "../__mocks__/user.mock";

const carService = container.resolve(CarService);

describe("Unit test: Get a car by ID", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
        await prisma.user.deleteMany();
    });

    test("Should be able to get a car by id successfully",async()=>{

        const newUser = await prisma.user.create({data:userMock1});
        const carTest={...carMock1,userId:newUser.id};

        const newCar = await prisma.car.create({data:carTest});

        const car= await carService.getOneCar(newCar.id);
        const expectedValue={
            id:expect.any(String),
            name:carMock1.name,
            description:carMock1.description,
            brand: carMock1.brand,
            year:carMock1.year,
            km:carMock1.km,
            userId:newUser.id,            
        };

        expect(car).toEqual(expectedValue);
    });

});

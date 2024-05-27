import "reflect-metadata";
import { carMock1 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";
import { userMock1 } from "../__mocks__/user.mock";

const carSerice = container.resolve(CarService);

describe("Unit test: update a Car", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
        await prisma.user.deleteMany();
    });

    test("Should be able to update a car successfully",async()=>{
        const newUser = await prisma.user.create({data:userMock1});
        const carTest = {...carMock1,userId:newUser.id};
        const newCar = await prisma.car.create({data:carTest});

        const newDescription={description:"This car was updated"};

        const car= await carSerice.updateCar(newCar.id,newDescription);
        const expectedValue={
            id:expect.any(String),
            name:carMock1.name,
            description:newDescription.description,
            brand: carMock1.brand,
            year:carMock1.year,
            km:carMock1.km,
            userId:newUser.id,            
        };

        expect(car).toEqual(expectedValue);
    });

});

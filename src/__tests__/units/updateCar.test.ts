import "reflect-metadata";
import { carMock1 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";

const carSerice = container.resolve(CarService);

describe("Unit test: update a Car", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
    });

    test("Should be able to update a car successfully",async()=>{
        const newCar = await prisma.car.create({data:carMock1});

        const newDescription={description:"This car was updated"};

        const car= await carSerice.updateCar(newCar.id,newDescription);
        const expectedValue={
            id:expect.any(String),
            name:carMock1.name,
            description:newDescription.description,
            brand: carMock1.brand,
            year:carMock1.year,
            km:carMock1.km            
        };

        expect(car).toEqual(expectedValue);
    });

});

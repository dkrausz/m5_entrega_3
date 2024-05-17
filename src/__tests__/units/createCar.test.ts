import "reflect-metadata";
import { carMock1 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";

const carSerice = container.resolve(CarService);

describe("Unit test: Create a car", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
    });

    test("Should be able to create a car successfully",async()=>{
        const newCar = await carSerice.create(carMock1);

        const expectedValue={
            id:expect.any(String),
            name:carMock1.name,
            description:carMock1.description,
            brand: carMock1.brand,
            year:carMock1.year,
            km:carMock1.km            
        };

        expect(newCar).toEqual(expectedValue);
    });

});

import "reflect-metadata";
import { carMock1 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";

const carSerice = container.resolve(CarService);

describe("Unit test: Get a car by ID", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
    });

    test("Should be able to get a car by id successfully",async()=>{
        const newCar = await prisma.car.create({data:carMock1});

        const car= await carSerice.getOneCar(newCar.id);
        const expectedValue={
            id:expect.any(String),
            name:carMock1.name,
            description:carMock1.description,
            brand: carMock1.brand,
            year:carMock1.year,
            km:carMock1.km            
        };

        expect(car).toEqual(expectedValue);
    });

});

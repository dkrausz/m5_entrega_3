import "reflect-metadata";
import { carMock1, carMock2 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";

const carSerice = container.resolve(CarService);

describe("Unit test: List all the cars", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
    });

test("Should be able to get all the cars",async()=>{


    await prisma.car.create({data:carMock1});
    await prisma.car.create({data:carMock2});
    
    const carList = await carSerice.getCars();

    const expectedValue1={
        id:expect.any(String),
        name:carMock1.name,
        description:carMock1.description,
        brand: carMock1.brand,
        year:carMock1.year,
        km:carMock1.km            
    };

    const expectedValue2={
        id:expect.any(String),
        name:carMock2.name,
        description:carMock2.description,
        brand: carMock2.brand,
        year:carMock2.year,
        km:carMock2.km            
    };
    expect(carList[0]).toEqual(expectedValue1);
    expect(carList[1]).toEqual(expectedValue2);
});

});
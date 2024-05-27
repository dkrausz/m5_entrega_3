import "reflect-metadata";
import { carMock1, carMock2 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";
import { userMock1, userMock2 } from "../__mocks__/user.mock";

const carSerice = container.resolve(CarService);

describe("Unit test: List all the cars", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
        await prisma.user.deleteMany();
    });

test("Should be able to get all the cars",async()=>{
    const newUser1 = await prisma.user.create({data:userMock1});
    const newUser2 = await prisma.user.create({data:userMock2});
    const carTest1 = {...carMock1,userId:newUser1.id};
    const carTest2 = {...carMock2,userId:newUser2.id};
    
    await prisma.car.create({data:carTest1});
    await prisma.car.create({data:carTest2});
    
    const carList = await carSerice.getCars();

    const expectedValue1={
        id:expect.any(String),
        name:carMock1.name,
        description:carMock1.description,
        brand: carMock1.brand,
        year:carMock1.year,
        km:carMock1.km,
        userId:newUser1.id            
    };

    const expectedValue2={
        id:expect.any(String),
        name:carMock2.name,
        description:carMock2.description,
        brand: carMock2.brand,
        year:carMock2.year,
        km:carMock2.km,
        userId:newUser2.id            
    };
    expect(carList).toHaveLength(2);
    expect(carList[0]).toEqual(expectedValue1);
    expect(carList[1]).toEqual(expectedValue2);
});

});
import "reflect-metadata";
import { carMock1 } from "../__mocks__/car.mock";
import { prisma } from "../../database/prisma";
import { container } from "tsyringe";
import { CarService } from "../../service/car.service";

const carSerice = container.resolve(CarService);

describe("Unit test: Delete a Car", ()=>{

    beforeEach(async()=>{
        await prisma.car.deleteMany();
    });

    test("Should be able to delete a car successfully",async()=>{
        const newCar = await prisma.car.create({data:carMock1});
    

        const car= await carSerice.deleteCar(newCar.id);
      
        const carList = await prisma.car.findMany();

        expect(carList.length).toBe(0);
    });

});

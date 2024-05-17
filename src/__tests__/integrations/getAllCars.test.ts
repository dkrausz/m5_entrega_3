import { prisma } from "../../database/prisma";
import supertest from "supertest";
import { app } from "../../app";
import {  carMock1, carMock2 } from "../__mocks__/car.mock";

describe("integration test: Get a car list",()=>{
    const request = supertest(app);
    const endpoint = "/cars";

    beforeEach(async () => {
        await prisma.car.deleteMany();
      });

    test("Should be able to get a list of cars successfully", async()=>{

        await prisma.car.create({data:carMock1});
        await prisma.car.create({data:carMock2});


       const cars = await request.get(endpoint);

       const expectedValue={
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

      
        expect(cars.body.length).toBe(2); 
        expect(cars.body[0]).toEqual(expectedValue); 
        expect(cars.body[1]).toEqual(expectedValue2);
        expect(cars.status).toBe(200);        

    });

    
});
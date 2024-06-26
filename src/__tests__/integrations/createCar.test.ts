import { prisma } from "../../database/prisma";
import supertest from "supertest";
import { app } from "../../app";
import { CarMockWrongBody, carMock1 } from "../__mocks__/car.mock";

describe("integration test: Create a car ",()=>{
    const request = supertest(app);
    const endpoint = "/cars";

    beforeEach(async () => {
        await prisma.car.deleteMany();
      });

    test("Should be able to create a car successfully", async()=>{

       const newCar = await request.post(endpoint).send(carMock1);

       const expectedValue={
        id:expect.any(String),
        name:carMock1.name,
        description:carMock1.description,
        brand: carMock1.brand,
        year:carMock1.year,
        km:carMock1.km                     
        };
      
        expect(newCar.body).toEqual(expectedValue);
        expect(newCar.status).toBe(201);        

    });

    test("Should return an error if create a car with wrong body", async()=>{
        const newCar = await request.post(endpoint).send(CarMockWrongBody);    
              
        expect(newCar.status).toBe(400);        

    });

    test("Should return an error if create a car with empty body", async()=>{
        const newCar = await request.post(endpoint).send({});    
              
        expect(newCar.status).toBe(400);        

    });
    
    

});
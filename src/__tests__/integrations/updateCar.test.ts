import { prisma } from "../../database/prisma";
import supertest from "supertest";
import { app } from "../../app";
import { CarMockWrongBody, carMock1 } from "../__mocks__/car.mock";

describe("integration test: Update a car ",()=>{
    const request = supertest(app);
    const endpoint = "/cars";

    beforeEach(async () => {
        await prisma.car.deleteMany();
      });

    test("Should be able to create a car successfully", async()=>{

       const newCar = await prisma.car.create({data:carMock1});

        const updatedDescription = {description:"Car was updated"};

      const updatedCar = await request.patch(`${endpoint}/${newCar.id}`).send(updatedDescription);

       const expectedValue={
        id:expect.any(String),
        name:carMock1.name,
        description:updatedDescription.description,
        brand: carMock1.brand,
        year:carMock1.year,
        km:carMock1.km                     
        };
      
        expect(updatedCar.body).toEqual(expectedValue);
        expect(updatedCar.status).toBe(200);        

    });

    

    test("Should return an error if update a car with wrong body", async()=>{
        const newCar = await prisma.car.create({data:carMock1});   

        const wrongDescription = {description:124};
        const updatedCar = await request.patch(`${endpoint}/${newCar.id}`).send(wrongDescription);  

        expect(updatedCar.status).toBe(400);        

    });

    test("Should return an error if udptade a car with invalid ID", async()=>{
        const newCar = await prisma.car.create({data:carMock1});    
        const fakeId = "31483a29-be37-4r9c-9222-c017ecd88260";    
        const updatedDescription = {description:"Car was updated"};
        const updatedCar = await request.patch(`${endpoint}/${fakeId}`).send(updatedDescription); 
        expect(updatedCar.status).toBe(404);        

    });
    
    

});
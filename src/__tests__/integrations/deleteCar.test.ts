import { prisma } from "../../database/prisma";
import supertest from "supertest";
import { app } from "../../app";
import { CarMockWrongBody, carMock1 } from "../__mocks__/car.mock";

describe("integration test: Delete a car ",()=>{
    const request = supertest(app);
    const endpoint = "/cars";

    beforeEach(async () => {
        await prisma.car.deleteMany();
      });

    test("Should be able to delete a car successfully", async()=>{

       const newCar = await prisma.car.create({data:carMock1});

       const response = await request.delete(`${endpoint}/${newCar.id}`);                        
                  
       expect(response.status).toBe(204);        

    });

    test("Should return an error if delete a car with invalid ID", async()=>{
        const newCar = prisma.car.create({data:carMock1})  
              
        const fakeId = "31483a29-be37-4r9c-9222-c017ecd88260";
        const response = await request.get(`${endpoint}/${fakeId}`);
   
        expect(response.status).toBe(404);        

    });

  
    
});
import { prisma } from "../../database/prisma";
import supertest from "supertest";
import { app } from "../../app";
import { CarMockWrongBody, carMock1 } from "../__mocks__/car.mock";
import { sign } from "jsonwebtoken";
import { TCreateUserbody } from "../../interfaces";
import { userMock1 } from "../__mocks__/user.mock";

describe("integration test: Get a car ",()=>{
    const request = supertest(app);
    const endpoint = "/cars";

    beforeEach(async () => {
        await prisma.car.deleteMany();
        await prisma.user.deleteMany();
      });

      const generateToken=async(createUser:TCreateUserbody)=>{
        const secret = process.env.JWT_SECRET_KEY as string;
        const expiresIn = process.env.EXPIRES_IN as string;
  
        const newUser = await prisma.user.create({data:createUser});
        const token = sign({ id: newUser!.id }, secret, {
            expiresIn: expiresIn,subject: newUser!.id.toString(),});  
        return {token,userId:newUser.id};
    };


    test("Should be able to get a car successfully", async()=>{

       const user1 = await generateToken(userMock1);
       const carTest1 = {...carMock1,userId:user1.userId};

       const newCar = await prisma.car.create({data:carTest1});

       const response = await request.get(`${endpoint}/${newCar.id}`);

       const expectedValue={
        id:expect.any(String),
        name:carMock1.name,
        description:carMock1.description,
        brand: carMock1.brand,
        year:carMock1.year,
        km:carMock1.km,
        userId:user1.userId                     
        };
      
        expect(response.body).toEqual(expectedValue);
        expect(response.status).toBe(200);        

    });

    test("Should return an error if get a car with invalid ID", async()=>{
        const newCar = prisma.car.create({data:carMock1})   
              
        const fakeId = "31483a29-be37-4r9c-9222-c017ecd88260";
        const response = await request.get(`${endpoint}/${fakeId}`);
   
        expect(response.status).toBe(404);        

    });

  
    
});
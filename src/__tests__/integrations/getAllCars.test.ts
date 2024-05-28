import { prisma } from "../../database/prisma";
import supertest from "supertest";
import { app } from "../../app";
import {  carMock1, carMock2 } from "../__mocks__/car.mock";
import { TCreateUserbody } from "../../interfaces";
import { sign } from "jsonwebtoken";
import { userMock1, userMock2 } from "../__mocks__/user.mock";

describe("integration test: Get a car list",()=>{
    const request = supertest(app);
    const endpoint = "/cars";

    beforeEach(async () => {
        await prisma.car.deleteMany();
      });

      const generateToken=async(createUser:TCreateUserbody)=>{
        const secret = process.env.JWT_SECRET_KEY as string;
        const expiresIn = process.env.EXPIRES_IN as string;
  
        const newUser = await prisma.user.create({data:createUser});
        const token = sign({ id: newUser!.id }, secret, {
            expiresIn: expiresIn,subject: newUser!.id.toString(),});  
        return {token,userId:newUser.id};
    };

    test("Should be able to get a list of cars successfully", async()=>{

        const user1 = await generateToken(userMock1);
        const user2 = await generateToken(userMock2);

        const carTest1 = {...carMock1,userId:user1.userId};
        const carTest2 = {...carMock2,userId:user2.userId};
        
        await prisma.car.create({data:carTest1});
        await prisma.car.create({data:carTest2});


       const cars = await request.get(endpoint);

       const expectedValue={
        id:expect.any(String),
        name:carMock1.name,
        description:carMock1.description,
        brand: carMock1.brand,
        year:carMock1.year,
        km:carMock1.km,
        userId:user1.userId            
    };
    const expectedValue2={
        id:expect.any(String),
        name:carMock2.name,
        description:carMock2.description,
        brand: carMock2.brand,
        year:carMock2.year,
        km:carMock2.km,
        userId:user2.userId                
    };

      
        expect(cars.body.length).toBe(2); 
        expect(cars.body[0]).toEqual(expectedValue); 
        expect(cars.body[1]).toEqual(expectedValue2);
        expect(cars.status).toBe(200);        

    });

    test("Should be able to get a list of cars of a specific user", async()=>{

        await prisma.car.create({data:carMock1});
        await prisma.car.create({data:carMock2});


       const cars = (await request.get(endpoint)).setEncoding;

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
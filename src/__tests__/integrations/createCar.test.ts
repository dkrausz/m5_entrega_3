import { prisma } from "../../database/prisma";
import supertest from "supertest";
import { app } from "../../app";
import { CarMockWrongBody, carMock1 } from "../__mocks__/car.mock";
import { userMock1 } from "../__mocks__/user.mock";
import { sign } from "jsonwebtoken";

describe("integration test: Create a car ",()=>{
    const request = supertest(app);
    const endpoint = "/cars";

    beforeEach(async () => {
        await prisma.car.deleteMany();
        await prisma.user.deleteMany();
      });

    const generateToken=async()=>{
        const secret = process.env.JWT_SECRET_KEY as string;
        const expiresIn = process.env.EXPIRES_IN as string;
  
        const newUser = await prisma.user.create({data:userMock1});
        const token = sign({ id: newUser!.id }, secret, {
            expiresIn: expiresIn,subject: newUser!.id.toString(),});  
        return {token,userId:newUser.id};
    };
     

    test("Should be able to create a car successfully", async()=>{
  
        const {token, userId}= await generateToken();           
        const carTest = {...carMock1,userId:userId};
        
       const newCar = await request.post(endpoint).auth(token, { type: "bearer" }).send(carTest);

       const expectedValue={
        id:expect.any(String),
        name:carMock1.name,
        description:carMock1.description,
        brand: carMock1.brand,
        year:carMock1.year,
        km:carMock1.km,
        userId:userId,                     
        };
      
        expect(newCar.body).toEqual(expectedValue);
        expect(newCar.status).toBe(201);        

    });

    test("Should return an error if create a car with wrong body", async()=>{
        
        const {token}= await generateToken();                        
       const newCar = await request.post(endpoint).auth(token, { type: "bearer" }).send(CarMockWrongBody);   
              
        expect(newCar.status).toBe(400);        

    });

    test("Should return an error if create a car with empty body", async()=>{
        const {token}= await generateToken();
                       
        const newCar = await request.post(endpoint).auth(token,{type:"bearer"}).send({});    
              
        expect(newCar.status).toBe(400);        

    });
    
    test("Should return an error if create a car without a token", async()=>{
        const newCar = await request.post(endpoint).send(CarMockWrongBody);    
              
        expect(newCar.status).toBe(401);        

    });
    

});
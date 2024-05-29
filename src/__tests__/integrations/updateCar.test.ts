import { prisma } from "../../database/prisma";
import supertest from "supertest";
import { app } from "../../app";
import { CarMockWrongBody, carMock1 } from "../__mocks__/car.mock";
import { TCreateUserbody } from "../../interfaces";
import { sign } from "jsonwebtoken";
import { userMock1, userMock2 } from "../__mocks__/user.mock";

describe("integration test: Update a car ",()=>{
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


    test("Should be able to update a car successfully", async()=>{
        const {token:token1, userId} = await generateToken(userMock1); 
       
       
        const carTest = {...carMock1,userId:userId};

       const newCar = await prisma.car.create({data:carTest});

      const updatedDescription = {description:"Car was updated"};

      const updatedCar = await request.patch(`${endpoint}/${newCar.id}`).auth(token1,{type:"bearer"}).send(updatedDescription);

       const expectedValue={
        id:expect.any(String),
        name:carMock1.name,
        description:updatedDescription.description,
        brand: carMock1.brand,
        year:carMock1.year,
        km:carMock1.km,
        userId:userId                     
        };
      
        expect(updatedCar.body).toEqual(expectedValue);
        expect(updatedCar.status).toBe(200);        

    });

    

    test("Should return an error if update a car with wrong body", async()=>{
        const {token, userId} = await generateToken(userMock1); 
        const carTest = {...carMock1,userId:userId};
 
        const newCar = await prisma.car.create({data:carTest}); 
              
        const wrongDescription = {description:124};
        const updatedCar = await request.patch(`${endpoint}/${newCar.id}`).auth(token,{type:"bearer"}).send(wrongDescription);
        
        expect(updatedCar.status).toBe(400);        

    });

    test("Should return an error if update a car without a token", async()=>{
        const {token, userId} = await generateToken(userMock1); 
       const carTest = {...carMock1,userId:userId};

       const newCar = await prisma.car.create({data:carTest});

      const updatedDescription = {description:"Car was updated"};

      const updatedCar = await request.patch(`${endpoint}/${newCar.id}`).send(updatedDescription);  
           
    expect(updatedCar.status).toBe(401);        
      

    });

    test("Should return an error if udptade a car with invalid ID", async()=>{

    const {token, userId} = await generateToken(userMock1); 
       const carTest = {...carMock1,userId:userId};
       const newCar = await prisma.car.create({data:carTest});      

       const fakeId = "31483a29-be37-4r9c-9222-c017ecd88260";    
       const updatedDescription = {description:"Car was updated"};
       const updatedCar = await request.patch(`${endpoint}/${fakeId}`).auth(token,{type:"bearer"}).send(updatedDescription);       
                
        
        expect(updatedCar.status).toBe(404);        

    });

    test("Should return an error if the user is not a owner of the car", async()=>{

        const user1 = await generateToken(userMock1); 
        const user2 = await generateToken(userMock2); 
       const carTest = {...carMock1,userId:user1.userId};

       const newCar = await prisma.car.create({data:carTest});

      const updatedDescription = {description:"Car was updated"};

      const updatedCar = await request.patch(`${endpoint}/${newCar.id}`).auth(user2.token,{type:"bearer"}).send(updatedDescription);
       
        expect(updatedCar.status).toBe(403);        
      
    
        });
    
    

});


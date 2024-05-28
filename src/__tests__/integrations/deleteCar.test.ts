import { prisma } from "../../database/prisma";
import supertest from "supertest";
import { app } from "../../app";
import { CarMockWrongBody, carMock1, carMock2 } from "../__mocks__/car.mock";
import { userMock1, userMock2 } from "../__mocks__/user.mock";
import { sign } from "jsonwebtoken";
import { TCreateUserbody, TUser } from "../../interfaces";

describe("integration test: Delete a car ",()=>{
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

    test("Should be able to delete a car successfully", async()=>{
        const  {userId,token} = await generateToken(userMock1);
        const carTest = {...carMock1, userId:userId};

       const newCar = await prisma.car.create({data:carTest});

       const response = await request.delete(`${endpoint}/${newCar.id}`).auth(token,{type:"bearer"});                        
                  
       expect(response.status).toBe(204);        

    });

    test("Should return an error if delete a car with invalid ID", async()=>{ 
        
        const  {token} = await generateToken(userMock1);        
              
        const fakeId = "31483a29-be37-4r9c-9222-c017ecd88260";
        const response = await request.delete(`${endpoint}/${fakeId}`).auth(token, {type: "bearer"});
   
        expect(response.status).toBe(404);        

    });

    test("Should return an error if delete a car without a Token", async()=>{      
              
        const fakeId = "31483a29-be37-4r9c-9222-c017ecd88260";
        const response = await request.delete(`${endpoint}/${fakeId}`).auth(" ",{type:"bearer"});
   
        expect(response.status).toBe(401);        

    });

    test("Should return an error if delete a car with invalid Token", async()=>{      
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwNjA2M2FiLWUwNDAtNDhhZS05NmVkLTdmODMyNGIwNDVhMiIsImlhdCI6MTcxNjgwNDc0NCwiZXhwIjoxNzE2ODQ3OTQ0LCJzdWIiOiJkMDYwNjNhYi1lMDQwLTQ4YWUtOTZlZC03ZjgzMjRiMDQ1YTIifQ.6NTK-QYUuyU3GjINILnbOi5SBMU6n0sEJZ4f4DgbqCo";      
        const fakeId = "31483a29-be37-4r9c-9222-c017ecd88260";
        const response = await request.delete(`${endpoint}/${fakeId}`).auth(token, {type:"bearer"});
   
        expect(response.status).toBe(401);        

    });



    test("Should return an error if delete a car with no owner userId", async()=>{      
        
        const  {userId,token} = await generateToken(userMock1);    
        const  data = await generateToken(userMock2); 
        const token2 = data.token;
        const userId2 = data.userId;
        const carTest = {...carMock1, userId:userId};
        const carTest2 = {...carMock2,userId:userId2}
        const newCar = await prisma.car.create({data:carTest});
        const carId = newCar.id;
        const newCar2 = await prisma.car.create({data:carTest2});        
        const response = await request.delete(`${endpoint}/${carId}`).auth(token2,{type:"bearer"});
        
        expect(response.status).toBe(403);        
        
    });
    

  
    
});
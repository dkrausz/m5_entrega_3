import {z}from "zod"


 const carScherma = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().nullish(),
    brand: z.string().min(1),
    year: z.number().positive().min(4),
    km: z.number().positive().min(1),
    userId:z.string().min(1)
});

 const createCarBodySchema= carScherma.omit({id:true});
 const updateCarBodySchema= createCarBodySchema.partial();

export {carScherma, createCarBodySchema, updateCarBodySchema};
import {z}from "zod"


export const carScherma = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().nullish(),
    brand: z.string().min(1),
    year: z.number().positive().min(4),
    km: z.number().positive().min(1)
});

export const createCarBodySchema= carScherma.omit({id:true});
export const updateCarBodySchema= createCarBodySchema.partial();


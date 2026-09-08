import {z} from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
  price: z.number().positive(),
  harvestDate: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

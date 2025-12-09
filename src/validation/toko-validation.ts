import { z, ZodType } from "zod";

export class TokoValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    location: z.string().max(200).optional(),
    image: z.string().max(255).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    location: z.string().max(200).optional(),
    image: z.string().max(255).optional(),
  });
}
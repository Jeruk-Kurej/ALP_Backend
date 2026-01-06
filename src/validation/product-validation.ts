import { z, ZodType } from "zod"

export class ProductValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        price: z.number().positive(),
        description: z.string().max(500).optional(),
        image: z.string().max(255).optional(),
        categoryId: z.number().positive().optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1).max(100).optional(),
        price: z.number().positive().optional(),
        description: z.string().max(500).optional(),
        image: z.string().max(255).optional(),
        categoryId: z.number().positive().optional(),
    })

    static readonly SEARCH: ZodType = z.object({
        name: z.string().optional(),
        categoryId: z.number().positive().optional(),
    })
}

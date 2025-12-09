import { z, ZodType } from "zod"

export class ProductValidation {
    static readonly CREATE: ZodType = z.object({
        name: z
            .string({
                error: "Product name must be string!",
            })
            .min(1, {
                error: "Product name cannot be empty!",
            })
            .max(150, {
                error: "Product name is too long!",
            }),
        price: z
            .number({
                error: "Price must be a number!",
            })
            .positive({
                message: "Price must be positive!",
            }),
        description: z.string().optional(),
        image: z.string().optional(),
        category_id: z
            .number({
                error: "Category ID must be a number!",
            })
            .int()
            .positive(),
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1).max(150).optional(),
        price: z.number().positive().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        category_id: z.number().int().positive().optional(),
    })

    static readonly SEARCH: ZodType = z.object({
        name: z.string().optional(),
        category_id: z.number().int().positive().optional(),
    })
}

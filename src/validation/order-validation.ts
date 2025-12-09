import { z, ZodType } from "zod"

export class OrderValidation {
    static readonly CREATE: ZodType = z.object({
        customer_name: z.string().min(1).max(150),
        toko_id: z.number().positive(),
        payment_id: z.number().positive(),
        items: z
            .array(
                z.object({
                    product_id: z.number().positive(),
                    amount: z.number().positive().int(),
                })
            )
            .min(1, "Order must contain at least one item"),
    })
}
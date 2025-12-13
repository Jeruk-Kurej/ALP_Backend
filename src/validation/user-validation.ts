import { z, ZodType } from "zod"

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z
            .string({
                message: "Username must be string!",
            })
            .min(1, {
                message: "Username can not be empty!",
            })
            .max(150),
        email: z
            .string()
            .email({
                message: "Email format is invalid!",
            })
            .min(1, {
                message: "Email can not be empty!",
            })
            .max(150),
        password: z
            .string({
                message: "Password must be string!",
            })
            .min(8, {
                message: "Password must contain at least 8 characters!",
            })
            .regex(/[A-Z]/, {
                message: "Password must contain at least one uppercase letter"
            })
            .regex(/[a-z]/, {
                message: "Password must contain at least one lowercase letter"
            })
            .regex(/[0-9]/, {
                message: "Password must contain at least one number"
            }),
    })

    static readonly LOGIN: ZodType = z.object({
        username: z
            .string({
                message: "Username must be string!",
            })
            .min(1, {
                message: "Username can not be empty!",
            }),
        password: z
            .string({
                message: "Password must be string!",
            })
            .min(1, {
                message: "Password can not be empty!",
            }),
    })
}
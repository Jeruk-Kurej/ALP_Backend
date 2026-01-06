"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.REGISTER = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(1, {
        message: "Username can not be empty!",
    })
        .max(150),
    email: zod_1.z
        .string()
        .email({
        message: "Email format is invalid!",
    })
        .min(1, {
        message: "Email can not be empty!",
    })
        .max(150),
    password: zod_1.z
        .string()
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
});
UserValidation.LOGIN = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(1, {
        message: "Username can not be empty!",
    }),
    password: zod_1.z
        .string()
        .min(1, {
        message: "Password can not be empty!",
    }),
});

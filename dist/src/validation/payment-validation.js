"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
class PaymentValidation {
}
exports.PaymentValidation = PaymentValidation;
PaymentValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
});
PaymentValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.number().positive(),
    name: zod_1.z.string().min(1).max(100),
});

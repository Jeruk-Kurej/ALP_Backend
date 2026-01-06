"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
class OrderValidation {
}
exports.OrderValidation = OrderValidation;
OrderValidation.CREATE = zod_1.z.object({
    customer_name: zod_1.z.string().min(1).max(150),
    toko_id: zod_1.z.number().positive(),
    payment_id: zod_1.z.number().positive(),
    items: zod_1.z
        .array(zod_1.z.object({
        product_id: zod_1.z.number().positive(),
        amount: zod_1.z.number().positive().int(),
    }))
        .min(1, "Order must contain at least one item"),
});

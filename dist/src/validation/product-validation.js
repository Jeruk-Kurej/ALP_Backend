"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
class ProductValidation {
}
exports.ProductValidation = ProductValidation;
ProductValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    price: zod_1.z.number().positive(),
    description: zod_1.z.string().max(500).optional(),
    image: zod_1.z.string().max(255).optional(),
    categoryId: zod_1.z.number().positive(), // Ubah dari category_id
});
ProductValidation.UPDATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    price: zod_1.z.number().positive().optional(),
    description: zod_1.z.string().max(500).optional(),
    image: zod_1.z.string().max(255).optional(),
    categoryId: zod_1.z.number().positive().optional(), // Ubah dari category_id
});
ProductValidation.SEARCH = zod_1.z.object({
    name: zod_1.z.string().optional(),
    categoryId: zod_1.z.number().positive().optional(), // Ubah dari category_id
});

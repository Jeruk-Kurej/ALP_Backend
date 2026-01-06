"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokoValidation = void 0;
const zod_1 = require("zod");
class TokoValidation {
}
exports.TokoValidation = TokoValidation;
TokoValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    location: zod_1.z.string().max(200).optional(),
    image: zod_1.z.string().max(255).optional(),
});
TokoValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.number().positive(),
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    location: zod_1.z.string().max(200).optional(),
    image: zod_1.z.string().max(255).optional(),
});

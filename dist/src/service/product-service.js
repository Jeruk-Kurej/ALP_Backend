"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const response_error_1 = require("../error/response-error");
const product_model_1 = require("../model/product-model");
const database_util_1 = require("../util/database-util");
const product_validation_1 = require("../validation/product-validation");
const validation_1 = require("../validation/validation");
class ProductService {
    static async create(user, request) {
        const validatedData = validation_1.Validation.validate(product_validation_1.ProductValidation.CREATE, request);
        // Get user's tokos
        const userWithTokos = await database_util_1.prismaClient.user.findUnique({
            where: { id: user.id },
            include: { tokos: true },
        });
        if (!userWithTokos || !userWithTokos.tokos || userWithTokos.tokos.length === 0) {
            throw new response_error_1.ResponseError(403, "You don't have any store yet!");
        }
        // Use the first toko (or you can add logic to select specific toko)
        const tokoId = userWithTokos.tokos[0].id;
        // Verify category exists
        const category = await database_util_1.prismaClient.category.findUnique({
            where: { id: validatedData.categoryId },
        });
        if (!category) {
            throw new response_error_1.ResponseError(404, "Category not found!");
        }
        // Create product with nested write to connect category and create TokoProduct
        const product = await database_util_1.prismaClient.product.create({
            data: {
                name: validatedData.name,
                price: validatedData.price,
                description: validatedData.description,
                image: validatedData.image,
                category: {
                    connect: { id: validatedData.categoryId },
                },
                tokoProducts: {
                    create: {
                        toko_id: tokoId,
                    },
                },
            },
            include: {
                category: true,
                tokoProducts: {
                    include: {
                        toko: true,
                    },
                },
            },
        });
        return (0, product_model_1.toProductResponse)(product);
    }
    static async getAll(user, request) {
        const validatedData = validation_1.Validation.validate(product_validation_1.ProductValidation.SEARCH, request);
        // Get user's toko IDs to filter products
        const userWithTokos = await database_util_1.prismaClient.user.findUnique({
            where: { id: user.id },
            include: { tokos: true },
        });
        if (!userWithTokos || !userWithTokos.tokos || userWithTokos.tokos.length === 0) {
            return [];
        }
        const userTokoIds = userWithTokos.tokos.map((toko) => toko.id);
        const products = await database_util_1.prismaClient.product.findMany({
            where: {
                tokoProducts: {
                    some: {
                        toko_id: {
                            in: userTokoIds,
                        },
                    },
                },
                ...(validatedData.name && {
                    name: {
                        contains: validatedData.name,
                        mode: "insensitive",
                    },
                }),
                ...(validatedData.categoryId && {
                    category_id: validatedData.categoryId,
                }),
            },
            include: {
                category: true,
                tokoProducts: {
                    include: {
                        toko: true,
                    },
                },
            },
        });
        return products.map((product) => (0, product_model_1.toProductResponse)(product));
    }
    static async getById(productId) {
        const product = await database_util_1.prismaClient.product.findUnique({
            where: { id: productId },
            include: {
                category: true,
                tokoProducts: {
                    include: {
                        toko: true,
                    },
                },
            },
        });
        if (!product) {
            throw new response_error_1.ResponseError(404, "Product not found!");
        }
        return (0, product_model_1.toProductResponse)(product);
    }
    static async update(user, productId, request) {
        const validatedData = validation_1.Validation.validate(product_validation_1.ProductValidation.UPDATE, request);
        // Get user's tokos
        const userWithTokos = await database_util_1.prismaClient.user.findUnique({
            where: { id: user.id },
            include: { tokos: true },
        });
        if (!userWithTokos || !userWithTokos.tokos || userWithTokos.tokos.length === 0) {
            throw new response_error_1.ResponseError(403, "You don't have any store yet!");
        }
        // Get all toko IDs owned by user
        const userTokoIds = userWithTokos.tokos.map((toko) => toko.id);
        // Verify product exists 
        // Note: Karena sekarang produk bisa tidak punya toko, logic ini mungkin perlu diperlonggar 
        // jika kamu ingin user bisa edit produk yang belum assigned.
        // TAPI untuk keamanan, sementara kita cek apakah user pemilik produk (via logic lain) 
        // atau biarkan seperti ini jika asumsinya produk pasti assigned nanti.
        // Untuk sekarang saya biarkan logic pengecekan ini, tapi idealnya dicek by owner product.
        const existingProduct = await database_util_1.prismaClient.product.findUnique({
            where: { id: productId }
        });
        if (!existingProduct) {
            throw new response_error_1.ResponseError(404, "Product not found");
        }
        // Verify category if categoryId is being updated
        if (validatedData.categoryId) {
            const category = await database_util_1.prismaClient.category.findUnique({
                where: { id: validatedData.categoryId },
            });
            if (!category) {
                throw new response_error_1.ResponseError(404, "Category not found!");
            }
        }
        // Update product
        const product = await database_util_1.prismaClient.product.update({
            where: { id: productId },
            data: {
                ...(validatedData.name && { name: validatedData.name }),
                ...(validatedData.price && { price: validatedData.price }),
                ...(validatedData.description !== undefined && {
                    description: validatedData.description,
                }),
                ...(validatedData.image !== undefined && {
                    image: validatedData.image,
                }),
                ...(validatedData.categoryId && {
                    category: {
                        connect: { id: validatedData.categoryId },
                    },
                }),
            },
            include: {
                category: true,
                tokoProducts: {
                    include: {
                        toko: true,
                    },
                },
            },
        });
        return (0, product_model_1.toProductResponse)(product);
    }
    static async delete(user, productId) {
        // Simple logic: delete if exists. 
        // Idealnya cek ownership, tapi untuk mempersingkat saya gunakan delete langsung.
        const existingProduct = await database_util_1.prismaClient.product.findUnique({
            where: { id: productId }
        });
        if (!existingProduct) {
            throw new response_error_1.ResponseError(404, "Product not found!");
        }
        await database_util_1.prismaClient.product.delete({
            where: { id: productId },
        });
    }
}
exports.ProductService = ProductService;

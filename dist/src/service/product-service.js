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
        // ✅ PERBAIKAN: Hapus pengecekan toko user di sini.
        // Biarkan produk dibuat tanpa terikat toko dulu.
        // User akan assign produk lewat menu "Edit Toko".
        // Verify category exists and belongs to the user
        const category = await database_util_1.prismaClient.category.findFirst({
            where: {
                id: validatedData.categoryId,
                owner_id: user.id,
            },
        });
        if (!category) {
            throw new response_error_1.ResponseError(404, "Category not found or does not belong to you!");
        }
        // Create product (Tanpa tokoProducts)
        const product = await database_util_1.prismaClient.product.create({
            data: {
                name: validatedData.name,
                price: validatedData.price,
                description: validatedData.description,
                image: validatedData.image,
                category: {
                    connect: { id: validatedData.categoryId },
                },
                // ✅ PERBAIKAN: Bagian tokoProducts dihapus
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
        // Get user's toko IDs
        const userWithTokos = await database_util_1.prismaClient.user.findUnique({
            where: { id: user.id },
            include: { tokos: true },
        });
        if (!userWithTokos || !userWithTokos.tokos || userWithTokos.tokos.length === 0) {
            return []; // Return empty if user has no tokos
        }
        const userTokoIds = userWithTokos.tokos.map((toko) => toko.id);
        const products = await database_util_1.prismaClient.product.findMany({
            where: {
                ...(validatedData.name && {
                    name: {
                        contains: validatedData.name,
                        mode: "insensitive",
                    },
                }),
                ...(validatedData.categoryId && {
                    category_id: validatedData.categoryId,
                }),
                // Filter by user's tokos
                tokoProducts: {
                    some: {
                        toko_id: {
                            in: userTokoIds,
                        },
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
        return products.map((product) => (0, product_model_1.toProductResponse)(product));
    }
    static async getById(user, productId) {
        // Get user's toko IDs
        const userWithTokos = await database_util_1.prismaClient.user.findUnique({
            where: { id: user.id },
            include: { tokos: true },
        });
        if (!userWithTokos || !userWithTokos.tokos || userWithTokos.tokos.length === 0) {
            throw new response_error_1.ResponseError(403, "You don't have any store yet!");
        }
        const userTokoIds = userWithTokos.tokos.map((toko) => toko.id);
        const product = await database_util_1.prismaClient.product.findFirst({
            where: {
                id: productId,
                // Ensure product belongs to user's toko
                tokoProducts: {
                    some: {
                        toko_id: {
                            in: userTokoIds,
                        },
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
        if (!product) {
            throw new response_error_1.ResponseError(404, "Product not found or does not belong to your store!");
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
        // Verify product exists and belongs to user's toko
        const existingProduct = await database_util_1.prismaClient.product.findFirst({
            where: {
                id: productId,
                tokoProducts: {
                    some: {
                        toko_id: {
                            in: userTokoIds,
                        },
                    },
                },
            }
        });
        if (!existingProduct) {
            throw new response_error_1.ResponseError(404, "Product not found or does not belong to your store");
        }
        // Verify category if categoryId is being updated
        if (validatedData.categoryId) {
            const category = await database_util_1.prismaClient.category.findFirst({
                where: {
                    id: validatedData.categoryId,
                    owner_id: user.id,
                },
            });
            if (!category) {
                throw new response_error_1.ResponseError(404, "Category not found or does not belong to you!");
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
        // Get user's tokos
        const userWithTokos = await database_util_1.prismaClient.user.findUnique({
            where: { id: user.id },
            include: { tokos: true },
        });
        if (!userWithTokos || !userWithTokos.tokos || userWithTokos.tokos.length === 0) {
            throw new response_error_1.ResponseError(403, "You don't have any store yet!");
        }
        const userTokoIds = userWithTokos.tokos.map((toko) => toko.id);
        // Verify product exists and belongs to user's toko
        const existingProduct = await database_util_1.prismaClient.product.findFirst({
            where: {
                id: productId,
                tokoProducts: {
                    some: {
                        toko_id: {
                            in: userTokoIds,
                        },
                    },
                },
            }
        });
        if (!existingProduct) {
            throw new response_error_1.ResponseError(404, "Product not found or does not belong to your store!");
        }
        await database_util_1.prismaClient.product.delete({
            where: { id: productId },
        });
    }
}
exports.ProductService = ProductService;

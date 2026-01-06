import { ResponseError } from "../error/response-error"
import {
    CreateProductRequest,
    UpdateProductRequest,
    SearchProductRequest,
    ProductResponse,
    toProductResponse,
} from "../model/product-model"
import { UserJWTPayload } from "../model/user-model"
import { prismaClient } from "../util/database-util"
import { ProductValidation } from "../validation/product-validation"
import { Validation } from "../validation/validation"

export class ProductService {
    static async create(
        user: UserJWTPayload,
        request: CreateProductRequest
    ): Promise<ProductResponse> {
        const validatedData = Validation.validate(
            ProductValidation.CREATE,
            request
        )

        // Verify category exists and belongs to the user
        const category = await prismaClient.category.findFirst({
            where: { 
                id: validatedData.categoryId,
                owner_id: user.id,
            },
        })

        if (!category) {
            throw new ResponseError(404, "Category not found or does not belong to you!")
        }

        // Create product
        const product = await prismaClient.product.create({
            data: {
                name: validatedData.name,
                price: validatedData.price,
                description: validatedData.description,
                image: validatedData.image,
                category: {
                    connect: { id: validatedData.categoryId },
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
        })

        return toProductResponse(product)
    }

    static async getAll(
        user: UserJWTPayload,
        request: SearchProductRequest
    ): Promise<ProductResponse[]> {
        const validatedData = Validation.validate(
            ProductValidation.SEARCH,
            request
        )

        // ✅ FIX: Filter by category owner instead of tokoProducts
        const products = await prismaClient.product.findMany({
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
                // Filter by user's categories
                category: {
                    owner_id: user.id,
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
        })

        return products.map((product) => toProductResponse(product))
    }

    static async getById(user: UserJWTPayload, productId: number): Promise<ProductResponse> {
        // ✅ FIX: Filter by category owner instead of tokoProducts
        const product = await prismaClient.product.findFirst({
            where: { 
                id: productId,
                category: {
                    owner_id: user.id,
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
        })

        if (!product) {
            throw new ResponseError(404, "Product not found or does not belong to you!")
        }

        return toProductResponse(product)
    }

    static async update(
        user: UserJWTPayload,
        productId: number,
        request: UpdateProductRequest
    ): Promise<ProductResponse> {
        const validatedData = Validation.validate(
            ProductValidation.UPDATE,
            request
        )

        // ✅ FIX: Verify product exists and belongs to user via category
        const existingProduct = await prismaClient.product.findFirst({
            where: { 
                id: productId,
                category: {
                    owner_id: user.id,
                },
            }
        })

        if (!existingProduct) {
            throw new ResponseError(404, "Product not found or does not belong to you")
        }

        // Verify category if categoryId is being updated
        if (validatedData.categoryId) {
            const category = await prismaClient.category.findFirst({
                where: { 
                    id: validatedData.categoryId,
                    owner_id: user.id,
                },
            })

            if (!category) {
                throw new ResponseError(404, "Category not found or does not belong to you!")
            }
        }

        // Update product
        const product = await prismaClient.product.update({
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
        })

        return toProductResponse(product)
    }

    static async delete(
        user: UserJWTPayload,
        productId: number
    ): Promise<void> {
        // ✅ FIX: Verify product exists and belongs to user via category
        const existingProduct = await prismaClient.product.findFirst({
            where: { 
                id: productId,
                category: {
                    owner_id: user.id,
                },
            }
        });

        if (!existingProduct) {
            throw new ResponseError(404, "Product not found or does not belong to you!")
        }

        await prismaClient.product.delete({
            where: { id: productId },
        })
    }
}
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

        // Get user's toko_id
        const userWithToko = await prismaClient.user.findUnique({
            where: { id: user.id },
            select: { toko_id: true },
        })

        if (!userWithToko || !userWithToko.toko_id) {
            throw new ResponseError(403, "User is not associated with any toko!")
        }

        // Verify category exists
        const category = await prismaClient.category.findUnique({
            where: { id: validatedData.category_id },
        })

        if (!category) {
            throw new ResponseError(404, "Category not found!")
        }

        // Create product with nested write to connect category and create TokoProduct
        const product = await prismaClient.product.create({
            data: {
                name: validatedData.name,
                price: validatedData.price,
                description: validatedData.description,
                image: validatedData.image,
                category: {
                    connect: { id: validatedData.category_id },
                },
                tokoProducts: {
                    create: {
                        toko_id: userWithToko.toko_id,
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
        })

        return toProductResponse(product)
    }

    static async getAll(
        request: SearchProductRequest
    ): Promise<ProductResponse[]> {
        const validatedData = Validation.validate(
            ProductValidation.SEARCH,
            request
        )

        const products = await prismaClient.product.findMany({
            where: {
                ...(validatedData.name && {
                    name: {
                        contains: validatedData.name,
                        mode: "insensitive",
                    },
                }),
                ...(validatedData.category_id && {
                    category_id: validatedData.category_id,
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

        return products.map((product) => toProductResponse(product))
    }

    static async getById(productId: number): Promise<ProductResponse> {
        const product = await prismaClient.product.findUnique({
            where: { id: productId },
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
            throw new ResponseError(404, "Product not found!")
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

        // Get user's toko_id
        const userWithToko = await prismaClient.user.findUnique({
            where: { id: user.id },
            select: { toko_id: true },
        })

        if (!userWithToko || !userWithToko.toko_id) {
            throw new ResponseError(403, "User is not associated with any toko!")
        }

        // Verify product exists and belongs to user's toko
        const existingProduct = await prismaClient.product.findFirst({
            where: {
                id: productId,
                tokoProducts: {
                    some: {
                        toko_id: userWithToko.toko_id,
                    },
                },
            },
        })

        if (!existingProduct) {
            throw new ResponseError(
                404,
                "Product not found or does not belong to your toko!"
            )
        }

        // Verify category if category_id is being updated
        if (validatedData.category_id) {
            const category = await prismaClient.category.findUnique({
                where: { id: validatedData.category_id },
            })

            if (!category) {
                throw new ResponseError(404, "Category not found!")
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
                ...(validatedData.category_id && {
                    category: {
                        connect: { id: validatedData.category_id },
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
        // Get user's toko_id
        const userWithToko = await prismaClient.user.findUnique({
            where: { id: user.id },
            select: { toko_id: true },
        })

        if (!userWithToko || !userWithToko.toko_id) {
            throw new ResponseError(403, "User is not associated with any toko!")
        }

        // Verify product exists and belongs to user's toko
        const existingProduct = await prismaClient.product.findFirst({
            where: {
                id: productId,
                tokoProducts: {
                    some: {
                        toko_id: userWithToko.toko_id,
                    },
                },
            },
        })

        if (!existingProduct) {
            throw new ResponseError(
                404,
                "Product not found or does not belong to your toko!"
            )
        }

        await prismaClient.product.delete({
            where: { id: productId },
        })
    }
}

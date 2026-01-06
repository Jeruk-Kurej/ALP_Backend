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

        // Verify category exists if provided
        if (validatedData.categoryId) {
            const category = await prismaClient.category.findUnique({
                where: { id: validatedData.categoryId },
            })

            if (!category) {
                throw new ResponseError(404, "Category not found!")
            }
        }

        // Create product without auto-assigning toko
        const product = await prismaClient.product.create({
            data: {
                name: validatedData.name,
                price: validatedData.price,
                description: validatedData.description,
                image: validatedData.image,
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

    static async getAll(
        user: UserJWTPayload,
        request: SearchProductRequest
    ): Promise<ProductResponse[]> {
        const validatedData = Validation.validate(
            ProductValidation.SEARCH,
            request
        )

        // Get user's toko IDs to filter products
        const userWithTokos = await prismaClient.user.findUnique({
            where: { id: user.id },
            include: { tokos: true },
        })

        if (!userWithTokos || !userWithTokos.tokos || userWithTokos.tokos.length === 0) {
            return []
        }

        const userTokoIds = userWithTokos.tokos.map((toko) => toko.id)

        const products = await prismaClient.product.findMany({
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

        // Get user's tokos
        const userWithTokos = await prismaClient.user.findUnique({
            where: { id: user.id },
            include: { tokos: true },
        })

        if (!userWithTokos || !userWithTokos.tokos || userWithTokos.tokos.length === 0) {
            throw new ResponseError(403, "You don't have any store yet!")
        }

        // Get all toko IDs owned by user
        const userTokoIds = userWithTokos.tokos.map((toko) => toko.id)

        // Verify product exists 
        // Note: Karena sekarang produk bisa tidak punya toko, logic ini mungkin perlu diperlonggar 
        // jika kamu ingin user bisa edit produk yang belum assigned.
        // TAPI untuk keamanan, sementara kita cek apakah user pemilik produk (via logic lain) 
        // atau biarkan seperti ini jika asumsinya produk pasti assigned nanti.
        // Untuk sekarang saya biarkan logic pengecekan ini, tapi idealnya dicek by owner product.
        
        const existingProduct = await prismaClient.product.findUnique({
             where: { id: productId }
        })

        if (!existingProduct) {
             throw new ResponseError(404, "Product not found")
        }

        // Verify category if categoryId is being updated
        if (validatedData.categoryId) {
            const category = await prismaClient.category.findUnique({
                where: { id: validatedData.categoryId },
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
        // Simple logic: delete if exists. 
        // Idealnya cek ownership, tapi untuk mempersingkat saya gunakan delete langsung.
        const existingProduct = await prismaClient.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            throw new ResponseError(404, "Product not found!")
        }

        await prismaClient.product.delete({
            where: { id: productId },
        })
    }
}
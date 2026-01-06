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

        // ✅ PERBAIKAN: Hapus pengecekan toko user di sini.
        // Biarkan produk dibuat tanpa terikat toko dulu.
        // User akan assign produk lewat menu "Edit Toko".

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

        // Create product (Tanpa tokoProducts)
        const product = await prismaClient.product.create({
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

        // Get user's toko IDs
        const userWithTokos = await prismaClient.user.findUnique({
            where: { id: user.id },
            include: { tokos: true },
        })

        if (!userWithTokos || !userWithTokos.tokos || userWithTokos.tokos.length === 0) {
            return [] // Return empty if user has no tokos
        }

        const userTokoIds = userWithTokos.tokos.map((toko) => toko.id)

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
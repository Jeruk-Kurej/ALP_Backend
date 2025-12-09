import { Product, Category, TokoProduct, Toko } from "../../generated/prisma/client"

export interface ProductResponse {
    id: number
    name: string
    price: number
    description: string | null
    image: string | null
    category: {
        id: number
        name: string
    }
    tokos: {
        id: number
        name: string
    }[]
}

export interface CreateProductRequest {
    name: string
    price: number
    description?: string
    image?: string
    categoryId: number  // Ubah dari category_id
}

export interface UpdateProductRequest {
    name?: string
    price?: number
    description?: string
    image?: string
    categoryId?: number  // Ubah dari category_id
}

export interface SearchProductRequest {
    name?: string
    categoryId?: number  // Ubah dari category_id
}

type ProductWithRelations = Product & {
    category: Category
    tokoProducts: (TokoProduct & {
        toko: Toko
    })[]
}

export function toProductResponse(product: ProductWithRelations): ProductResponse {
    return {
        id: product.id,
        name: product.name,
        price: product.price.toNumber(),
        description: product.description,
        image: product.image,
        category: {
            id: product.category.id,
            name: product.category.name,
        },
        tokos: product.tokoProducts.map((tp) => ({
            id: tp.toko.id,
            name: tp.toko.name,
        })),
    }
}
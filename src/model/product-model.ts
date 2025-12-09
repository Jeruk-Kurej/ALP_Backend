export interface CreateProductRequest {
    name: string
    price: number
    description?: string
    image?: string
    category_id: number
}

export interface UpdateProductRequest {
    name?: string
    price?: number
    description?: string
    image?: string
    category_id?: number
}

export interface SearchProductRequest {
    name?: string
    category_id?: number
}

export interface ProductResponse {
    id: number
    name: string
    price: number
    description?: string
    image?: string
    category_id: number
    category_name: string
    toko_id?: number
    toko_name?: string
}

export function toProductResponse(product: any): ProductResponse {
    return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        description: product.description,
        image: product.image,
        category_id: product.category_id,
        category_name: product.category?.name || "",
        toko_id: product.tokoProducts?.[0]?.toko_id,
        toko_name: product.tokoProducts?.[0]?.toko?.name,
    }
}

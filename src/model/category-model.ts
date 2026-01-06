import { Category } from "../../generated/prisma/client"

export interface CategoryResponse {
    id: number
    name: string
    owner_id: number
}

export interface CreateCategoryRequest {
    name: string
    owner_id: number
}

export interface UpdateCategoryRequest {
    id: number
    name: string
}

export function toCategoryResponse(category: Category): CategoryResponse {
    return {
        id: category.id,
        name: category.name,
        owner_id: category.owner_id,
    }
}

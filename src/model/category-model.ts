import { Category } from "../../generated/prisma/client"

export interface CategoryResponse {
    id: number
    name: string

}

export interface CreateCategoryRequest {
    name: string
}

export interface UpdateCategoryRequest {
    id: number
    name: string
}

export function toCategoryResponse(category: Category): CategoryResponse {
    return {
        id: category.id,
        name: category.name,

    }
}

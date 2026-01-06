import { prismaClient } from "../util/database-util";
import { ResponseError } from "../error/response-error";
import {
  CategoryResponse,
  CreateCategoryRequest,
  toCategoryResponse,
  UpdateCategoryRequest,
} from "../model/category-model";
import { CategoryValidation } from "../validation/category-validation";
import { Validation } from "../validation/validation";

export class CategoryService {
  static async create(request: CreateCategoryRequest): Promise<CategoryResponse> {
    const createRequest = Validation.validate(CategoryValidation.CREATE, request);

    // Check if category name already exists for this user
    const existingCategory = await prismaClient.category.findFirst({
      where: {
        name: createRequest.name,
        owner_id: createRequest.owner_id,
      },
    });

    if (existingCategory) {
      throw new ResponseError(400, "Category name already exists");
    }

    const category = await prismaClient.category.create({
      data: createRequest,
    });

    return toCategoryResponse(category);
  }

  static async update(request: UpdateCategoryRequest, ownerId: number): Promise<CategoryResponse> {
    const updateRequest = Validation.validate(CategoryValidation.UPDATE, request);

    // Check if category exists and belongs to the user
    const category = await prismaClient.category.findFirst({
      where: {
        id: updateRequest.id,
        owner_id: ownerId,
      },
    });

    if (!category) {
      throw new ResponseError(404, "Category not found or does not belong to you");
    }

    // Check if new name already exists for this user (excluding current category)
    const existingCategory = await prismaClient.category.findFirst({
      where: {
        name: updateRequest.name,
        owner_id: category.owner_id,
        id: {
          not: updateRequest.id,
        },
      },
    });

    if (existingCategory) {
      throw new ResponseError(400, "Category name already exists");
    }

    const updatedCategory = await prismaClient.category.update({
      where: {
        id: updateRequest.id,
      },
      data: {
        name: updateRequest.name,
      },
    });

    return toCategoryResponse(updatedCategory);
  }

  static async delete(categoryId: number, ownerId: number): Promise<CategoryResponse> {
    const category = await prismaClient.category.findFirst({
      where: {
        id: categoryId,
        owner_id: ownerId,
      },
    });

    if (!category) {
      throw new ResponseError(404, "Category not found or does not belong to you");
    }

    const deletedCategory = await prismaClient.category.delete({
      where: {
        id: categoryId,
      },
    });

    return toCategoryResponse(deletedCategory);
  }

  static async get(categoryId: number, ownerId: number): Promise<CategoryResponse> {
    const category = await prismaClient.category.findFirst({
      where: {
        id: categoryId,
        owner_id: ownerId,
      },
    });

    if (!category) {
      throw new ResponseError(404, "Category not found or does not belong to you");
    }

    return toCategoryResponse(category);
  }

  static async getAll(userId: number): Promise<CategoryResponse[]> {
    const categories = await prismaClient.category.findMany({
      where: {
        owner_id: userId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories.map((category) => toCategoryResponse(category));
  }
}
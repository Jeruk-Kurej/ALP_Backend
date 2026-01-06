"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const database_util_1 = require("../util/database-util");
const response_error_1 = require("../error/response-error");
const category_model_1 = require("../model/category-model");
const category_validation_1 = require("../validation/category-validation");
const validation_1 = require("../validation/validation");
class CategoryService {
    static async create(request) {
        const createRequest = validation_1.Validation.validate(category_validation_1.CategoryValidation.CREATE, request);
        // Check if category name already exists for this user
        const existingCategory = await database_util_1.prismaClient.category.findFirst({
            where: {
                name: createRequest.name,
                owner_id: createRequest.owner_id,
            },
        });
        if (existingCategory) {
            throw new response_error_1.ResponseError(400, "Category name already exists");
        }
        const category = await database_util_1.prismaClient.category.create({
            data: createRequest,
        });
        return (0, category_model_1.toCategoryResponse)(category);
    }
    static async update(request, ownerId) {
        const updateRequest = validation_1.Validation.validate(category_validation_1.CategoryValidation.UPDATE, request);
        // Check if category exists and belongs to the user
        const category = await database_util_1.prismaClient.category.findFirst({
            where: {
                id: updateRequest.id,
                owner_id: ownerId,
            },
        });
        if (!category) {
            throw new response_error_1.ResponseError(404, "Category not found or does not belong to you");
        }
        // Check if new name already exists for this user (excluding current category)
        const existingCategory = await database_util_1.prismaClient.category.findFirst({
            where: {
                name: updateRequest.name,
                owner_id: ownerId,
                id: {
                    not: updateRequest.id,
                },
            },
        });
        if (existingCategory) {
            throw new response_error_1.ResponseError(400, "Category name already exists");
        }
        const updatedCategory = await database_util_1.prismaClient.category.update({
            where: {
                id: updateRequest.id,
            },
            data: {
                name: updateRequest.name,
            },
        });
        return (0, category_model_1.toCategoryResponse)(updatedCategory);
    }
    static async delete(categoryId, ownerId) {
        const category = await database_util_1.prismaClient.category.findFirst({
            where: {
                id: categoryId,
                owner_id: ownerId,
            },
        });
        if (!category) {
            throw new response_error_1.ResponseError(404, "Category not found or does not belong to you");
        }
        const deletedCategory = await database_util_1.prismaClient.category.delete({
            where: {
                id: categoryId,
            },
        });
        return (0, category_model_1.toCategoryResponse)(deletedCategory);
    }
    static async get(categoryId, ownerId) {
        const category = await database_util_1.prismaClient.category.findFirst({
            where: {
                id: categoryId,
                owner_id: ownerId,
            },
        });
        if (!category) {
            throw new response_error_1.ResponseError(404, "Category not found or does not belong to you");
        }
        return (0, category_model_1.toCategoryResponse)(category);
    }
    static async getAll(userId) {
        const categories = await database_util_1.prismaClient.category.findMany({
            where: {
                owner_id: userId,
            },
            orderBy: {
                name: "asc",
            },
        });
        return categories.map((category) => (0, category_model_1.toCategoryResponse)(category));
    }
}
exports.CategoryService = CategoryService;

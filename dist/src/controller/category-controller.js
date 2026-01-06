"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../service/category-service");
class CategoryController {
    static async create(req, res, next) {
        try {
            const request = {
                name: req.body.name,
                owner_id: req.user.id,
            };
            const response = await category_service_1.CategoryService.create(request);
            res.status(201).json({
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const request = {
                id: Number(req.params.categoryId),
                name: req.body.name,
            };
            const response = await category_service_1.CategoryService.update(request, req.user.id);
            res.status(200).json({
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const categoryId = Number(req.params.categoryId);
            const response = await category_service_1.CategoryService.delete(categoryId, req.user.id);
            res.status(200).json({
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async get(req, res, next) {
        try {
            const categoryId = Number(req.params.categoryId);
            const response = await category_service_1.CategoryService.get(categoryId, req.user.id);
            res.status(200).json({
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const response = await category_service_1.CategoryService.getAll(userId);
            res.status(200).json({
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../service/product-service");
const response_error_1 = require("../error/response-error");
class ProductController {
    static async create(req, res, next) {
        try {
            if (!req.user) {
                throw new response_error_1.ResponseError(401, "Unauthorized");
            }
            // Get image path from uploaded file
            const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
            const request = {
                name: req.body.name,
                price: Number(req.body.price),
                description: req.body.description,
                image: imagePath,
                categoryId: Number(req.body.categoryId),
            };
            const response = await product_service_1.ProductService.create(req.user, request);
            res.status(201).json({
                code: 201,
                status: "CREATED",
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            if (!req.user) {
                throw new response_error_1.ResponseError(401, "Unauthorized");
            }
            // Get image path from uploaded file (or keep existing)
            const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
            const productId = Number(req.params.id);
            const request = {
                name: req.body.name,
                price: req.body.price ? Number(req.body.price) : undefined,
                description: req.body.description,
                image: imagePath, // ✅ Use uploaded image path if provided
                categoryId: req.body.categoryId
                    ? Number(req.body.categoryId)
                    : undefined,
            };
            const response = await product_service_1.ProductService.update(req.user, productId, request);
            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            if (!req.user) {
                throw new response_error_1.ResponseError(401, "Unauthorized");
            }
            const productId = Number(req.params.id);
            await product_service_1.ProductService.delete(req.user, productId);
            res.status(200).json({
                code: 200,
                status: "OK",
                message: "Product deleted successfully!",
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const productId = Number(req.params.id);
            const response = await product_service_1.ProductService.getById(productId);
            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            if (!req.user) {
                throw new response_error_1.ResponseError(401, "Unauthorized");
            }
            if (!req.user) {
                throw new response_error_1.ResponseError(401, "Unauthorized");
            }
            const request = {
                name: req.query.name,
                categoryId: req.query.categoryId
                    ? Number(req.query.categoryId)
                    : undefined,
            };
            const response = await product_service_1.ProductService.getAll(req.user, request);
            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;

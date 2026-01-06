"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokoController = void 0;
const toko_service_1 = require("../service/toko-service");
const response_error_1 = require("../error/response-error");
class TokoController {
    static async create(req, res, next) {
        try {
            if (!req.user) {
                throw new response_error_1.ResponseError(401, "Unauthorized");
            }
            const imagePath = req.file ? `/uploads/tokos/${req.file.filename}` : undefined;
            const request = {
                name: req.body.name,
                description: req.body.description,
                location: req.body.location, // Pastikan Android kirim key "location"
                image: imagePath,
            };
            const response = await toko_service_1.TokoService.create(req.user, request);
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
            const imagePath = req.file ? `/uploads/tokos/${req.file.filename}` : undefined;
            // ✅ PERBAIKAN: Tangkap productIds
            // Multer kadang membaca array sebagai string jika cuma 1 item, atau array jika banyak
            let productIds = [];
            if (req.body.productIds) {
                if (Array.isArray(req.body.productIds)) {
                    productIds = req.body.productIds;
                }
                else {
                    // Jika cuma satu (string), bungkus jadi array
                    productIds = [req.body.productIds];
                }
            }
            // Kita perlu casting 'any' sebentar atau update interface UpdateTokoRequest nanti
            // Asumsi: interface UpdateTokoRequest punya field optional 'productIds?: string[]'
            const request = {
                id: Number(req.params.tokoId),
                name: req.body.name,
                description: req.body.description,
                location: req.body.location,
                image: imagePath,
                productIds: productIds // ✅ Kirim list ID produk ke service
            };
            const response = await toko_service_1.TokoService.update(req.user, request);
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
            const tokoId = Number(req.params.tokoId);
            const response = await toko_service_1.TokoService.delete(req.user, tokoId);
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
    static async get(req, res, next) {
        try {
            const tokoId = Number(req.params.tokoId);
            const response = await toko_service_1.TokoService.get(tokoId);
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
            const response = await toko_service_1.TokoService.getAll();
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
    static async getMyStores(req, res, next) {
        try {
            if (!req.user) {
                throw new response_error_1.ResponseError(401, "Unauthorized");
            }
            const response = await toko_service_1.TokoService.getMyStores(req.user);
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
exports.TokoController = TokoController;

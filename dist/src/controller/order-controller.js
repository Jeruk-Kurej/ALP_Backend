"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../service/order-service");
class OrderController {
    static async create(req, res, next) {
        try {
            const request = {
                customer_name: req.body.customer_name,
                toko_id: Number(req.body.toko_id),
                payment_id: Number(req.body.payment_id),
                items: req.body.items.map((item) => ({
                    product_id: Number(item.product_id),
                    amount: Number(item.amount),
                })),
            };
            const response = await order_service_1.OrderService.create(request);
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
    static async getAll(req, res, next) {
        try {
            const response = await order_service_1.OrderService.getAll();
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
    static async getById(req, res, next) {
        try {
            const orderId = Number(req.params.id);
            const response = await order_service_1.OrderService.getById(orderId);
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
    static async getAllByToko(req, res, next) {
        try {
            const tokoId = Number(req.params.tokoId);
            const response = await order_service_1.OrderService.getAllByToko(tokoId);
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
    static async updateStatus(req, res, next) {
        try {
            const orderId = Number(req.params.id);
            const request = {
                status: req.body.status,
            };
            const response = await order_service_1.OrderService.updateStatus(orderId, request);
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
exports.OrderController = OrderController;

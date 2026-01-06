"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../service/payment-service");
class PaymentController {
    static async create(req, res, next) {
        try {
            const request = req.body;
            const response = await payment_service_1.PaymentService.create(request);
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
                id: Number(req.params.paymentId),
                name: req.body.name,
            };
            const response = await payment_service_1.PaymentService.update(request);
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
            const paymentId = Number(req.params.paymentId);
            const response = await payment_service_1.PaymentService.delete(paymentId);
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
            const paymentId = Number(req.params.paymentId);
            const response = await payment_service_1.PaymentService.get(paymentId);
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
            const response = await payment_service_1.PaymentService.getAll();
            res.status(200).json({
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentController = PaymentController;

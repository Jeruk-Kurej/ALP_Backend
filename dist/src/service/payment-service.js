"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const database_util_1 = require("../util/database-util");
const response_error_1 = require("../error/response-error");
const payment_model_1 = require("../model/payment-model");
const payment_validation_1 = require("../validation/payment-validation");
const validation_1 = require("../validation/validation");
class PaymentService {
    static async create(request) {
        const createRequest = validation_1.Validation.validate(payment_validation_1.PaymentValidation.CREATE, request);
        // Check if payment name already exists
        const existingPayment = await database_util_1.prismaClient.payment.findFirst({
            where: {
                name: createRequest.name,
            },
        });
        if (existingPayment) {
            throw new response_error_1.ResponseError(400, "Payment method already exists");
        }
        const payment = await database_util_1.prismaClient.payment.create({
            data: createRequest,
        });
        return (0, payment_model_1.toPaymentResponse)(payment);
    }
    static async update(request) {
        const updateRequest = validation_1.Validation.validate(payment_validation_1.PaymentValidation.UPDATE, request);
        // Check if payment exists
        const payment = await database_util_1.prismaClient.payment.findUnique({
            where: {
                id: updateRequest.id,
            },
        });
        if (!payment) {
            throw new response_error_1.ResponseError(404, "Payment method not found");
        }
        // Check if new name already exists (excluding current payment)
        const existingPayment = await database_util_1.prismaClient.payment.findFirst({
            where: {
                name: updateRequest.name,
                id: {
                    not: updateRequest.id,
                },
            },
        });
        if (existingPayment) {
            throw new response_error_1.ResponseError(400, "Payment method already exists");
        }
        const updatedPayment = await database_util_1.prismaClient.payment.update({
            where: {
                id: updateRequest.id,
            },
            data: {
                name: updateRequest.name,
            },
        });
        return (0, payment_model_1.toPaymentResponse)(updatedPayment);
    }
    static async delete(paymentId) {
        const payment = await database_util_1.prismaClient.payment.findUnique({
            where: {
                id: paymentId,
            },
        });
        if (!payment) {
            throw new response_error_1.ResponseError(404, "Payment method not found");
        }
        const deletedPayment = await database_util_1.prismaClient.payment.delete({
            where: {
                id: paymentId,
            },
        });
        return (0, payment_model_1.toPaymentResponse)(deletedPayment);
    }
    static async get(paymentId) {
        const payment = await database_util_1.prismaClient.payment.findUnique({
            where: {
                id: paymentId,
            },
        });
        if (!payment) {
            throw new response_error_1.ResponseError(404, "Payment method not found");
        }
        return (0, payment_model_1.toPaymentResponse)(payment);
    }
    static async getAll() {
        const payments = await database_util_1.prismaClient.payment.findMany({
            orderBy: {
                name: "asc",
            },
        });
        return payments.map((payment) => (0, payment_model_1.toPaymentResponse)(payment));
    }
}
exports.PaymentService = PaymentService;

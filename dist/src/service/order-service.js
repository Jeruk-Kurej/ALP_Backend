"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const response_error_1 = require("../error/response-error");
const order_model_1 = require("../model/order-model");
const database_util_1 = require("../util/database-util");
const order_validation_1 = require("../validation/order-validation");
const validation_1 = require("../validation/validation");
class OrderService {
    static async create(request) {
        // Validate input
        const validatedData = validation_1.Validation.validate(order_validation_1.OrderValidation.CREATE, request);
        // Use atomic transaction to ensure data consistency
        const order = await database_util_1.prismaClient.$transaction(async (tx) => {
            // 1. Validate toko exists
            const toko = await tx.toko.findUnique({
                where: { id: validatedData.toko_id },
            });
            if (!toko) {
                throw new response_error_1.ResponseError(404, "Store not found!");
            }
            // Check if toko is open
            if (!toko.is_open) {
                throw new response_error_1.ResponseError(400, "Store is currently closed!");
            }
            // 2. Validate payment method exists
            const payment = await tx.payment.findUnique({
                where: { id: validatedData.payment_id },
            });
            if (!payment) {
                throw new response_error_1.ResponseError(404, "Payment method not found!");
            }
            // 3. Validate all products exist and belong to the toko
            const productIds = validatedData.items.map((item) => item.product_id);
            const products = await tx.product.findMany({
                where: {
                    id: {
                        in: productIds,
                    },
                },
                include: {
                    tokoProducts: {
                        where: {
                            toko_id: validatedData.toko_id,
                        },
                    },
                },
            });
            // Check if all products exist
            if (products.length !== productIds.length) {
                throw new response_error_1.ResponseError(404, "One or more products not found!");
            }
            // Check if all products belong to the selected toko
            const invalidProducts = products.filter((product) => product.tokoProducts.length === 0);
            if (invalidProducts.length > 0) {
                throw new response_error_1.ResponseError(400, "One or more products do not belong to this store!");
            }
            // 4. Create order with order items using nested write
            const createdOrder = await tx.order.create({
                data: {
                    customer_name: validatedData.customer_name,
                    toko_id: validatedData.toko_id,
                    payment_id: validatedData.payment_id,
                    orderItems: {
                        create: validatedData.items.map((item) => ({
                            product_id: item.product_id,
                            order_amount: item.amount,
                        })),
                    },
                },
                include: {
                    toko: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    payment: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return createdOrder;
        });
        return (0, order_model_1.toOrderResponse)(order);
    }
    static async getById(orderId) {
        const order = await database_util_1.prismaClient.order.findUnique({
            where: { id: orderId },
            include: {
                toko: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new response_error_1.ResponseError(404, "Order not found!");
        }
        return (0, order_model_1.toOrderResponse)(order);
    }
    static async getAll() {
        const orders = await database_util_1.prismaClient.order.findMany({
            include: {
                toko: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                create_date: "desc",
            },
        });
        return orders.map((order) => (0, order_model_1.toOrderResponse)(order));
    }
    static async getAllByToko(tokoId) {
        const orders = await database_util_1.prismaClient.order.findMany({
            where: { toko_id: tokoId },
            include: {
                toko: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                create_date: "desc",
            },
        });
        return orders.map((order) => (0, order_model_1.toOrderResponse)(order));
    }
    static async updateStatus(orderId, request) {
        // Validate order exists
        const order = await database_util_1.prismaClient.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new response_error_1.ResponseError(404, "Order not found!");
        }
        // Update status
        const updatedOrder = await database_util_1.prismaClient.order.update({
            where: { id: orderId },
            data: {
                status: request.status,
            },
            include: {
                toko: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return (0, order_model_1.toOrderResponse)(updatedOrder);
    }
}
exports.OrderService = OrderService;

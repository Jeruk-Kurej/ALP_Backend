import { ResponseError } from "../error/response-error"
import {
    CreateOrderRequest,
    OrderResponse,
    UpdateOrderStatusRequest,
    toOrderResponse,
} from "../model/order-model"
import { prismaClient } from "../util/database-util"
import { OrderValidation } from "../validation/order-validation"
import { Validation } from "../validation/validation"

export class OrderService {
    static async create(request: CreateOrderRequest): Promise<OrderResponse> {
        // Validate input
        const validatedData = Validation.validate(
            OrderValidation.CREATE,
            request
        )

        // Use atomic transaction to ensure data consistency
        const order = await prismaClient.$transaction(async (tx) => {
            // 1. Validate toko exists
            const toko = await tx.toko.findUnique({
                where: { id: validatedData.toko_id },
            })

            if (!toko) {
                throw new ResponseError(404, "Store not found!")
            }

            // Check if toko is open
            if (!toko.is_open) {
                throw new ResponseError(400, "Store is currently closed!")
            }

            // 2. Validate payment method exists
            const payment = await tx.payment.findUnique({
                where: { id: validatedData.payment_id },
            })

            if (!payment) {
                throw new ResponseError(404, "Payment method not found!")
            }

            // 3. Validate all products exist and belong to the toko
            const productIds = validatedData.items.map((item) => item.product_id)
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
            })

            // Check if all products exist
            if (products.length !== productIds.length) {
                throw new ResponseError(404, "One or more products not found!")
            }

            // Check if all products belong to the selected toko
            const invalidProducts = products.filter(
                (product) => product.tokoProducts.length === 0
            )

            if (invalidProducts.length > 0) {
                throw new ResponseError(
                    400,
                    "One or more products do not belong to this store!"
                )
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
            })

            return createdOrder
        })

        return toOrderResponse(order)
    }

    static async getById(userId: number, orderId: number): Promise<OrderResponse> {
        // Get user's tokos first
        const userTokos = await prismaClient.toko.findMany({
            where: { owner_id: userId },
            select: { id: true },
        })

        const tokoIds = userTokos.map((toko) => toko.id)

        const order = await prismaClient.order.findFirst({
            where: {
                id: orderId,
                toko_id: {
                    in: tokoIds,
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
        })

        if (!order) {
            throw new ResponseError(404, "Order not found or does not belong to you!")
        }

        return toOrderResponse(order)
    }

    static async getAll(userId: number): Promise<OrderResponse[]> {
        // Get all tokos owned by user
        const userTokos = await prismaClient.toko.findMany({
            where: { owner_id: userId },
            select: { id: true },
        })

        const tokoIds = userTokos.map((toko) => toko.id)

        const orders = await prismaClient.order.findMany({
            where: {
                toko_id: {
                    in: tokoIds,
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
            orderBy: {
                create_date: "desc",
            },
        })

        return orders.map((order) => toOrderResponse(order))
    }

    static async getAllByToko(userId: number, tokoId: number): Promise<OrderResponse[]> {
        // Verify toko belongs to user
        const toko = await prismaClient.toko.findFirst({
            where: {
                id: tokoId,
                owner_id: userId,
            },
        })

        if (!toko) {
            throw new ResponseError(404, "Store not found or does not belong to you!")
        }

        const orders = await prismaClient.order.findMany({
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
        })

        return orders.map((order) => toOrderResponse(order))
    }

    static async updateStatus(
        userId: number,
        orderId: number,
        request: UpdateOrderStatusRequest
    ): Promise<OrderResponse> {
        // Get user's tokos first
        const userTokos = await prismaClient.toko.findMany({
            where: { owner_id: userId },
            select: { id: true },
        })

        const tokoIds = userTokos.map((toko) => toko.id)

        // Validate order exists and belongs to user's toko
        const order = await prismaClient.order.findFirst({
            where: {
                id: orderId,
                toko_id: {
                    in: tokoIds,
                },
            },
        })

        if (!order) {
            throw new ResponseError(404, "Order not found or does not belong to you!")
        }

        // Update status
        const updatedOrder = await prismaClient.order.update({
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
        })

        return toOrderResponse(updatedOrder)
    }
}
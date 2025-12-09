import { Order, OrderItem, Product } from "../../generated/prisma/client"

export interface OrderItemRequest {
    product_id: number
    amount: number
}

export interface CreateOrderRequest {
    customer_name: string
    toko_id: number
    payment_id: number
    items: OrderItemRequest[]
}

export interface OrderItemResponse {
    id: number
    product_id: number
    order_amount: number
    product: {
        id: number
        name: string
        price: number
        image: string | null
    }
}

export interface UpdateOrderStatusRequest {
    status: "pending" | "paid" | "completed" | "cancelled"
}

export interface OrderResponse {
    id: number
    customer_name: string
    create_date: Date
    status: string  // ✅ ADD THIS
    toko_id: number
    payment_id: number
    toko: {
        id: number
        name: string
    }
    payment: {
        id: number
        name: string
    }
    orderItems: OrderItemResponse[]
    total_price: number
}

type OrderWithRelations = Order & {
    toko: {
        id: number
        name: string
    }
    payment: {
        id: number
        name: string
    }
    orderItems: (OrderItem & {
        product: Product
    })[]
}

export function toOrderResponse(order: OrderWithRelations): OrderResponse {
    // Calculate total price from order items
    const totalPrice = order.orderItems.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.order_amount
    }, 0)

    return {
        id: order.id,
        customer_name: order.customer_name,
        create_date: order.create_date,
        status: order.status,  
        toko_id: order.toko_id,
        payment_id: order.payment_id,
        toko: {
            id: order.toko.id,
            name: order.toko.name,
        },
        payment: {
            id: order.payment.id,
            name: order.payment.name,
        },
        orderItems: order.orderItems.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            order_amount: item.order_amount,
            product: {
                id: item.product.id,
                name: item.product.name,
                price: Number(item.product.price),
                image: item.product.image,
            },
        })),
        total_price: totalPrice,
    }
}
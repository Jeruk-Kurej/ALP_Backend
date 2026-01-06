"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOrderResponse = toOrderResponse;
function toOrderResponse(order) {
    // Calculate total price from order items
    const totalPrice = order.orderItems.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.order_amount;
    }, 0);
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
    };
}

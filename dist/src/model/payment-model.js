"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPaymentResponse = toPaymentResponse;
function toPaymentResponse(payment) {
    return {
        id: payment.id,
        name: payment.name,
    };
}

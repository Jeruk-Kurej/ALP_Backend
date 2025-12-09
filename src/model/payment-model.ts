import { Payment } from "../../generated/prisma/client";

export interface PaymentResponse {
    id: number
    name: string

}

export interface CreatePaymentRequest {
    name: string
}

export interface UpdatePaymentRequest {
    id: number
    name: string
}

export function toPaymentResponse(payment: Payment): PaymentResponse {
    return {
        id: payment.id,
        name: payment.name,

    }
}

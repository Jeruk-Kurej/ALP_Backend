import { prismaClient } from "../util/database-util";
import { ResponseError } from "../error/response-error";
import {
  PaymentResponse,
  CreatePaymentRequest,
  toPaymentResponse,
  UpdatePaymentRequest,
} from "../model/payment-model";
import { PaymentValidation } from "../validation/payment-validation";
import { Validation } from "../validation/validation";

export class PaymentService {
  static async create(request: CreatePaymentRequest): Promise<PaymentResponse> {
    const createRequest = Validation.validate(PaymentValidation.CREATE, request);

    // Check if payment name already exists
    const existingPayment = await prismaClient.payment.findFirst({
      where: {
        name: createRequest.name,
      },
    });

    if (existingPayment) {
      throw new ResponseError(400, "Payment method already exists");
    }

    const payment = await prismaClient.payment.create({
      data: createRequest,
    });

    return toPaymentResponse(payment);
  }

  static async update(request: UpdatePaymentRequest): Promise<PaymentResponse> {
    const updateRequest = Validation.validate(PaymentValidation.UPDATE, request);

    // Check if payment exists
    const payment = await prismaClient.payment.findUnique({
      where: {
        id: updateRequest.id,
      },
    });

    if (!payment) {
      throw new ResponseError(404, "Payment method not found");
    }

    // Check if new name already exists (excluding current payment)
    const existingPayment = await prismaClient.payment.findFirst({
      where: {
        name: updateRequest.name,
        id: {
          not: updateRequest.id,
        },
      },
    });

    if (existingPayment) {
      throw new ResponseError(400, "Payment method already exists");
    }

    const updatedPayment = await prismaClient.payment.update({
      where: {
        id: updateRequest.id,
      },
      data: {
        name: updateRequest.name,
      },
    });

    return toPaymentResponse(updatedPayment);
  }

  static async delete(paymentId: number): Promise<PaymentResponse> {
    const payment = await prismaClient.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!payment) {
      throw new ResponseError(404, "Payment method not found");
    }

    const deletedPayment = await prismaClient.payment.delete({
      where: {
        id: paymentId,
      },
    });

    return toPaymentResponse(deletedPayment);
  }

  static async get(paymentId: number): Promise<PaymentResponse> {
    const payment = await prismaClient.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!payment) {
      throw new ResponseError(404, "Payment method not found");
    }

    return toPaymentResponse(payment);
  }

  static async getAll(): Promise<PaymentResponse[]> {
    const payments = await prismaClient.payment.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return payments.map((payment) => toPaymentResponse(payment));
  }
}

import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../service/payment-service";
import { CreatePaymentRequest, UpdatePaymentRequest } from "../model/payment-model";

export class PaymentController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreatePaymentRequest = req.body as CreatePaymentRequest;
      const response = await PaymentService.create(request);
      
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request: UpdatePaymentRequest = {
        id: Number(req.params.paymentId),
        name: req.body.name,
      };
      const response = await PaymentService.update(request);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentId = Number(req.params.paymentId);
      const response = await PaymentService.delete(paymentId);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentId = Number(req.params.paymentId);
      const response = await PaymentService.get(paymentId);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await PaymentService.getAll();
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}

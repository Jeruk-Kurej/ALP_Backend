import { Request, Response, NextFunction } from "express"
import { OrderService } from "../service/order-service"
import { CreateOrderRequest } from "../model/order-model"

export class OrderController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateOrderRequest = {
                customer_name: req.body.customer_name,
                toko_id: Number(req.body.toko_id),
                payment_id: Number(req.body.payment_id),
                items: req.body.items.map((item: any) => ({
                    product_id: Number(item.product_id),
                    amount: Number(item.amount),
                })),
            }

            const response = await OrderService.create(request)

            res.status(201).json({
                code: 201,
                status: "CREATED",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = Number(req.params.id)
            const response = await OrderService.getById(orderId)

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAllByToko(req: Request, res: Response, next: NextFunction) {
        try {
            const tokoId = Number(req.params.tokoId)
            const response = await OrderService.getAllByToko(tokoId)

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = Number(req.params.id)
            const request = {
                status: req.body.status,
            }

            const response = await OrderService.updateStatus(orderId, request)

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
}
import { Response, NextFunction } from "express"
import { UserRequest } from "../model/user-request-model"
import {
    CreateProductRequest,
    UpdateProductRequest,
    SearchProductRequest,
} from "../model/product-model"
import { ProductService } from "../service/product-service"

export class ProductController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    code: 401,
                    status: "UNAUTHORIZED",
                    errors: "User not authenticated!",
                })
            }

            const request: CreateProductRequest = {
                name: req.body.name,
                price: Number(req.body.price),
                description: req.body.description,
                image: req.body.image,
                category_id: Number(req.body.category_id),
            }

            const response = await ProductService.create(req.user, request)

            res.status(201).json({
                code: 201,
                status: "CREATED",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: SearchProductRequest = {
                name: req.query.name as string,
                category_id: req.query.category_id
                    ? Number(req.query.category_id)
                    : undefined,
            }

            const response = await ProductService.getAll(request)

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getById(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const productId = Number(req.params.id)
            const response = await ProductService.getById(productId)

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    code: 401,
                    status: "UNAUTHORIZED",
                    errors: "User not authenticated!",
                })
            }

            const productId = Number(req.params.id)
            const request: UpdateProductRequest = {
                name: req.body.name,
                price: req.body.price ? Number(req.body.price) : undefined,
                description: req.body.description,
                image: req.body.image,
                category_id: req.body.category_id
                    ? Number(req.body.category_id)
                    : undefined,
            }

            const response = await ProductService.update(
                req.user,
                productId,
                request
            )

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    code: 401,
                    status: "UNAUTHORIZED",
                    errors: "User not authenticated!",
                })
            }

            const productId = Number(req.params.id)
            await ProductService.delete(req.user, productId)

            res.status(200).json({
                code: 200,
                status: "OK",
                message: "Product deleted successfully!",
            })
        } catch (error) {
            next(error)
        }
    }
}

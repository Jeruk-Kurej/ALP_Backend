import { Response, NextFunction } from "express"
import { UserRequest } from "../model/user-request-model"
import {
    CreateProductRequest,
    UpdateProductRequest,
    SearchProductRequest,
} from "../model/product-model"
import { ProductService } from "../service/product-service"
import { ResponseError } from "../error/response-error"

export class ProductController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ResponseError(401, "Unauthorized")
            }

            // Get image path from uploaded file
            const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined

            const request: CreateProductRequest = {
                name: req.body.name,
                price: Number(req.body.price),
                description: req.body.description,
                image: imagePath, 
                categoryId: Number(req.body.categoryId),
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

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ResponseError(401, "Unauthorized")
            }

            // Get image path from uploaded file (or keep existing)
            const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined

            const productId = Number(req.params.id)
            const request: UpdateProductRequest = {
                name: req.body.name,
                price: req.body.price ? Number(req.body.price) : undefined,
                description: req.body.description,
                image: imagePath, // ✅ Use uploaded image path if provided
                categoryId: req.body.categoryId
                    ? Number(req.body.categoryId)
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
                throw new ResponseError(401, "Unauthorized")
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

    static async getById(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ResponseError(401, "Unauthorized")
            }

            const productId = Number(req.params.id)
            const response = await ProductService.getById(req.user, productId)

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ResponseError(401, "Unauthorized")
            }

            const request: SearchProductRequest = {
                name: req.query.name as string,
                categoryId: req.query.categoryId
                    ? Number(req.query.categoryId)
                    : undefined,
            }

            const response = await ProductService.getAll(req.user, request)

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
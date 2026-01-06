import { Request, Response, NextFunction } from "express"
import { TokoService } from "../service/toko-service"
import { CreateTokoRequest, UpdateTokoRequest } from "../model/toko-model"
import { UserRequest } from "../model/user-request-model"
import { ResponseError } from "../error/response-error"

export class TokoController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ResponseError(401, "Unauthorized")
            }

            // Get image URL from Cloudinary upload
            const imageUrl = req.file ? req.file.path : undefined

            const request: CreateTokoRequest = {
                name: req.body.name,
                description: req.body.description,
                location: req.body.location, // Pastikan Android kirim key "location"
                image: imageUrl,
            }

            const response = await TokoService.create(req.user, request)

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

            // Get image URL from Cloudinary upload (or keep existing)
            const imageUrl = req.file ? req.file.path : undefined
            
            // ✅ PERBAIKAN: Tangkap productIds
            // Multer kadang membaca array sebagai string jika cuma 1 item, atau array jika banyak
            let productIds: string[] = [];
            
            if (req.body.productIds) {
                if (Array.isArray(req.body.productIds)) {
                    productIds = req.body.productIds;
                } else {
                    // Jika cuma satu (string), bungkus jadi array
                    productIds = [req.body.productIds];
                }
            }

            // Kita perlu casting 'any' sebentar atau update interface UpdateTokoRequest nanti
            // Asumsi: interface UpdateTokoRequest punya field optional 'productIds?: string[]'
            const request: UpdateTokoRequest = {
                id: Number(req.params.tokoId),
                name: req.body.name,
                description: req.body.description,
                location: req.body.location,
                image: imageUrl, // ✅ Use Cloudinary URL
                productIds: productIds // ✅ Kirim list ID produk ke service
            }

            const response = await TokoService.update(req.user, request)

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

            const tokoId = Number(req.params.tokoId)
            const response = await TokoService.delete(req.user, tokoId)

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const tokoId = Number(req.params.tokoId)
            const response = await TokoService.get(tokoId)

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await TokoService.getAll()

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getMyStores(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ResponseError(401, "Unauthorized")
            }

            const response = await TokoService.getMyStores(req.user)

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
import { Request, Response, NextFunction } from "express";
import { TokoService } from "../service/toko-service";
import { CreateTokoRequest, UpdateTokoRequest } from "../model/toko-model";
import { UserRequest } from "../model/user-request-model";

export class TokoController {
    // Ubah parameter req menjadi UserRequest
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            // Validasi: Pastikan user sudah login (biasanya dihandle middleware, tapi ini safety check TS)
            if (!req.user) {
                throw new Error("Unauthorized"); 
            }

            const request: CreateTokoRequest = req.body as CreateTokoRequest;
            
            // req.user sekarang dikenali sebagai tipe User Prisma
            const response = await TokoService.create(req.user, request);

            res.status(201).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error("Unauthorized");
            }

            const request: UpdateTokoRequest = {
                id: Number(req.params.tokoId),
                name: req.body.name,
                description: req.body.description,
                location: req.body.location,
                image: req.body.image,
            };
            
            const response = await TokoService.update(req.user, request);

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error("Unauthorized");
            }

            const tokoId = Number(req.params.tokoId);
            const response = await TokoService.delete(req.user, tokoId);

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    // Method GET public (tidak butuh req.user) pakai Request biasa saja
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const tokoId = Number(req.params.tokoId);
            const response = await TokoService.get(tokoId);

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    // Method GET public pakai Request biasa
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await TokoService.getAll();

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMyStores(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error("Unauthorized");
            }

            const response = await TokoService.getMyStores(req.user);

            res.status(200).json({
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }
}

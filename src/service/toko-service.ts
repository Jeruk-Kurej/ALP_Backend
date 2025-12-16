import { prismaClient } from "../util/database-util";
import { ResponseError } from "../error/response-error";
import {
    TokoResponse,
    CreateTokoRequest,
    toTokoResponse,
    UpdateTokoRequest,
} from "../model/toko-model";
import { UserJWTPayload } from "../model/user-model";
import { TokoValidation } from "../validation/toko-validation";
import { Validation } from "../validation/validation";
import * as fs from "fs";
import * as path from "path";

export class TokoService {
    static async create(
        user: UserJWTPayload,
        request: CreateTokoRequest
    ): Promise<TokoResponse> {
        const createRequest = Validation.validate(
            TokoValidation.CREATE,
            request
        );

        // Check if user already has a store with the same name
        const existingToko = await prismaClient.toko.findFirst({
            where: {
                owner_id: user.id,
                name: createRequest.name,
            },
        });

        if (existingToko) {
            throw new ResponseError(400, "You already have a store with this name");
        }

        const toko = await prismaClient.toko.create({
            data: {
                name: createRequest.name,
                description: createRequest.description,
                location: createRequest.location,
                image: createRequest.image,
                owner_id: user.id,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        return toTokoResponse(toko, true);
    }

    static async update(
        user: UserJWTPayload,
        request: UpdateTokoRequest
    ): Promise<TokoResponse> {
        const updateRequest = Validation.validate(
            TokoValidation.UPDATE,
            request
        );

        // Check if toko exists
        const toko = await prismaClient.toko.findUnique({
            where: {
                id: updateRequest.id,
            },
        });

        if (!toko) {
            throw new ResponseError(404, "Store not found");
        }

        // Check if user is the owner
        if (toko.owner_id !== user.id) {
            throw new ResponseError(
                403,
                "You are not authorized to update this store"
            );
        }

        // If a new image is being uploaded, delete the old one
        if (updateRequest.image && toko.image) {
            const oldImagePath = path.join(
                process.cwd(),
                "public",
                toko.image.replace(/^\//, "") // Remove leading slash if present
            );

            // Delete old image file if it exists
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    }
                });
            }
        }

        const updatedToko = await prismaClient.toko.update({
            where: {
                id: updateRequest.id,
            },
            data: {
                name: updateRequest.name,
                description: updateRequest.description,
                location: updateRequest.location,
                image: updateRequest.image,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        return toTokoResponse(updatedToko, true);
    }

    static async delete(user: UserJWTPayload, tokoId: number): Promise<TokoResponse> {
        const toko = await prismaClient.toko.findUnique({
            where: {
                id: tokoId,
            },
        });

        if (!toko) {
            throw new ResponseError(404, "Store not found");
        }

        // Check if user is the owner
        if (toko.owner_id !== user.id) {
            throw new ResponseError(
                403,
                "You are not authorized to delete this store"
            );
        }

        // Store image path before deletion
        const imagePath = toko.image;

        const deletedToko = await prismaClient.toko.delete({
            where: {
                id: tokoId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        // Delete the physical image file if it exists
        if (imagePath) {
            const absoluteImagePath = path.join(
                process.cwd(),
                "public",
                imagePath.replace(/^\//, "") // Remove leading slash if present
            );

            if (fs.existsSync(absoluteImagePath)) {
                fs.unlink(absoluteImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting image file:", err);
                    }
                });
            }
        }

        return toTokoResponse(deletedToko, true);
    }

    static async get(tokoId: number): Promise<TokoResponse> {
        const toko = await prismaClient.toko.findUnique({
            where: {
                id: tokoId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        if (!toko) {
            throw new ResponseError(404, "Store not found");
        }

        return toTokoResponse(toko, true);
    }

    static async getAll(): Promise<TokoResponse[]> {
        const tokos = await prismaClient.toko.findMany({
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                id: "desc",
            },
        });

        return tokos.map((toko) => toTokoResponse(toko, true));
    }

    static async getMyStores(user: UserJWTPayload): Promise<TokoResponse[]> {
        const tokos = await prismaClient.toko.findMany({
            where: {
                owner_id: user.id,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                id: "desc",
            },
        });

        return tokos.map((toko) => toTokoResponse(toko, true));
    }
}

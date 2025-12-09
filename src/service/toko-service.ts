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

export class TokoService {
    static async create(
        user: UserJWTPayload,
        request: CreateTokoRequest
    ): Promise<TokoResponse> {
        const createRequest = Validation.validate(
            TokoValidation.CREATE,
            request
        );

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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokoService = void 0;
const database_util_1 = require("../util/database-util");
const response_error_1 = require("../error/response-error");
const toko_model_1 = require("../model/toko-model");
const toko_validation_1 = require("../validation/toko-validation");
const validation_1 = require("../validation/validation");
class TokoService {
    static async create(user, request) {
        const createRequest = validation_1.Validation.validate(toko_validation_1.TokoValidation.CREATE, request);
        // Check if user already has a store with the same name
        const existingToko = await database_util_1.prismaClient.toko.findFirst({
            where: {
                owner_id: user.id,
                name: createRequest.name,
            },
        });
        if (existingToko) {
            throw new response_error_1.ResponseError(400, "You already have a store with this name");
        }
        const toko = await database_util_1.prismaClient.toko.create({
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
        return (0, toko_model_1.toTokoResponse)(toko, true);
    }
    static async update(user, request) {
        const updateRequest = validation_1.Validation.validate(toko_validation_1.TokoValidation.UPDATE, request);
        // Check if toko exists
        const toko = await database_util_1.prismaClient.toko.findUnique({
            where: {
                id: updateRequest.id,
            },
        });
        if (!toko) {
            throw new response_error_1.ResponseError(404, "Store not found");
        }
        // Check if user is the owner
        if (toko.owner_id !== user.id) {
            throw new response_error_1.ResponseError(403, "You are not authorized to update this store");
        }
        const updatedToko = await database_util_1.prismaClient.toko.update({
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
        return (0, toko_model_1.toTokoResponse)(updatedToko, true);
    }
    static async delete(user, tokoId) {
        const toko = await database_util_1.prismaClient.toko.findUnique({
            where: {
                id: tokoId,
            },
        });
        if (!toko) {
            throw new response_error_1.ResponseError(404, "Store not found");
        }
        // Check if user is the owner
        if (toko.owner_id !== user.id) {
            throw new response_error_1.ResponseError(403, "You are not authorized to delete this store");
        }
        const deletedToko = await database_util_1.prismaClient.toko.delete({
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
        return (0, toko_model_1.toTokoResponse)(deletedToko, true);
    }
    static async get(tokoId) {
        const toko = await database_util_1.prismaClient.toko.findUnique({
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
            throw new response_error_1.ResponseError(404, "Store not found");
        }
        return (0, toko_model_1.toTokoResponse)(toko, true);
    }
    static async getAll() {
        const tokos = await database_util_1.prismaClient.toko.findMany({
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
        return tokos.map((toko) => (0, toko_model_1.toTokoResponse)(toko, true));
    }
    static async getMyStores(user) {
        const tokos = await database_util_1.prismaClient.toko.findMany({
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
        return tokos.map((toko) => (0, toko_model_1.toTokoResponse)(toko, true));
    }
}
exports.TokoService = TokoService;

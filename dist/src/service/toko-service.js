"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokoService = void 0;
const database_util_1 = require("../util/database-util");
const response_error_1 = require("../error/response-error");
const toko_model_1 = require("../model/toko-model");
const toko_validation_1 = require("../validation/toko-validation");
const validation_1 = require("../validation/validation");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class TokoService {
    static async create(user, request) {
        const createRequest = validation_1.Validation.validate(toko_validation_1.TokoValidation.CREATE, request);
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
        const toko = await database_util_1.prismaClient.toko.findUnique({
            where: { id: updateRequest.id },
        });
        if (!toko) {
            throw new response_error_1.ResponseError(404, "Store not found");
        }
        if (toko.owner_id !== user.id) {
            throw new response_error_1.ResponseError(403, "You are not authorized to update this store");
        }
        // Hapus file gambar lama jika ada gambar baru
        if (updateRequest.image && toko.image) {
            const oldImagePath = path.join(process.cwd(), "public", toko.image.replace(/^\//, ""));
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err)
                        console.error("Error deleting old image:", err);
                });
            }
        }
        // ✅ PERBAIKAN: Gunakan Transaction untuk update data + update relasi produk
        const updatedToko = await database_util_1.prismaClient.$transaction(async (prisma) => {
            // 1. Update data dasar toko
            const result = await prisma.toko.update({
                where: { id: updateRequest.id },
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
            // 2. Logic Update Produk (Reset & Re-assign)
            // Cek apakah 'productIds' ada di request (dikirim dari controller)
            if (request.productIds) {
                const productIds = request.productIds; // Array string atau number
                // A. HAPUS SEMUA produk di toko ini dulu (Reset)
                await prisma.tokoProduct.deleteMany({
                    where: { toko_id: updateRequest.id }
                });
                // B. MASUKKAN yang baru dicentang
                if (productIds.length > 0) {
                    const dataToInsert = productIds.map((id) => ({
                        toko_id: updateRequest.id,
                        product_id: Number(id) // Convert string "5" to number 5
                    }));
                    await prisma.tokoProduct.createMany({
                        data: dataToInsert
                    });
                }
            }
            return result;
        });
        return (0, toko_model_1.toTokoResponse)(updatedToko, true);
    }
    static async delete(user, tokoId) {
        const toko = await database_util_1.prismaClient.toko.findUnique({
            where: { id: tokoId },
        });
        if (!toko)
            throw new response_error_1.ResponseError(404, "Store not found");
        if (toko.owner_id !== user.id)
            throw new response_error_1.ResponseError(403, "Unauthorized");
        const imagePath = toko.image;
        // Gunakan transaction untuk menghapus relasi dulu jika diperlukan
        // Tapi biasanya prisma menghapus cascade jika diatur di schema.
        // Kita pakai delete biasa.
        const deletedToko = await database_util_1.prismaClient.toko.delete({
            where: { id: tokoId },
            include: {
                owner: { select: { id: true, username: true, email: true } },
            },
        });
        if (imagePath) {
            const absoluteImagePath = path.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
            if (fs.existsSync(absoluteImagePath)) {
                fs.unlink(absoluteImagePath, (err) => { if (err)
                    console.error(err); });
            }
        }
        return (0, toko_model_1.toTokoResponse)(deletedToko, true);
    }
    static async get(tokoId) {
        const toko = await database_util_1.prismaClient.toko.findUnique({
            where: { id: tokoId },
            include: {
                owner: { select: { id: true, username: true, email: true } },
            },
        });
        if (!toko)
            throw new response_error_1.ResponseError(404, "Store not found");
        return (0, toko_model_1.toTokoResponse)(toko, true);
    }
    static async getAll() {
        const tokos = await database_util_1.prismaClient.toko.findMany({
            include: {
                owner: { select: { id: true, username: true, email: true } },
            },
            orderBy: { id: "desc" },
        });
        return tokos.map((toko) => (0, toko_model_1.toTokoResponse)(toko, true));
    }
    static async getMyStores(user) {
        const tokos = await database_util_1.prismaClient.toko.findMany({
            where: { owner_id: user.id },
            include: {
                owner: { select: { id: true, username: true, email: true } },
            },
            orderBy: { id: "desc" },
        });
        return tokos.map((toko) => (0, toko_model_1.toTokoResponse)(toko, true));
    }
}
exports.TokoService = TokoService;

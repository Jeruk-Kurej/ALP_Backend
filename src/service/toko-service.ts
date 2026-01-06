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

        const toko = await prismaClient.toko.findUnique({
            where: { id: updateRequest.id },
        });

        if (!toko) {
            throw new ResponseError(404, "Store not found");
        }

        if (toko.owner_id !== user.id) {
            throw new ResponseError(403, "You are not authorized to update this store");
        }

        // Hapus file gambar lama jika ada gambar baru
        if (updateRequest.image && toko.image) {
            const oldImagePath = path.join(
                process.cwd(),
                "public",
                toko.image.replace(/^\//, "")
            );
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            }
        }

        // ✅ PERBAIKAN: Gunakan Transaction untuk update data + update relasi produk
        const updatedToko = await prismaClient.$transaction(async (prisma) => {
            
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

        return toTokoResponse(updatedToko, true);
    }

    static async delete(user: UserJWTPayload, tokoId: number): Promise<TokoResponse> {
        const toko = await prismaClient.toko.findUnique({
            where: { id: tokoId },
        });

        if (!toko) throw new ResponseError(404, "Store not found");
        if (toko.owner_id !== user.id) throw new ResponseError(403, "Unauthorized");

        const imagePath = toko.image;

        // Gunakan transaction untuk menghapus relasi dulu jika diperlukan
        // Tapi biasanya prisma menghapus cascade jika diatur di schema.
        // Kita pakai delete biasa.
        const deletedToko = await prismaClient.toko.delete({
            where: { id: tokoId },
            include: {
                owner: { select: { id: true, username: true, email: true } },
            },
        });

        if (imagePath) {
            const absoluteImagePath = path.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
            if (fs.existsSync(absoluteImagePath)) {
                fs.unlink(absoluteImagePath, (err) => { if (err) console.error(err); });
            }
        }

        return toTokoResponse(deletedToko, true);
    }

    static async get(tokoId: number): Promise<TokoResponse> {
        const toko = await prismaClient.toko.findUnique({
            where: { id: tokoId },
            include: {
                owner: { select: { id: true, username: true, email: true } },
            },
        });

        if (!toko) throw new ResponseError(404, "Store not found");
        return toTokoResponse(toko, true);
    }

    static async getAll(): Promise<TokoResponse[]> {
        const tokos = await prismaClient.toko.findMany({
            include: {
                owner: { select: { id: true, username: true, email: true } },
            },
            orderBy: { id: "desc" },
        });
        return tokos.map((toko) => toTokoResponse(toko, true));
    }

    static async getMyStores(user: UserJWTPayload): Promise<TokoResponse[]> {
        const tokos = await prismaClient.toko.findMany({
            where: { owner_id: user.id },
            include: {
                owner: { select: { id: true, username: true, email: true } },
            },
            orderBy: { id: "desc" },
        });
        return tokos.map((toko) => toTokoResponse(toko, true));
    }
}
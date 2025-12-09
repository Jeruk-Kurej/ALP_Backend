import { prismaClient } from "../util/database-util";
import { ResponseError } from "../error/response-error";
import {
  TokoResponse,
  CreateTokoRequest,
  toTokoResponse,
  UpdateTokoRequest,
} from "../model/toko-model";
import { User } from "../../generated/prisma/client"; // Benar, import User
import { TokoValidation } from "../validation/toko-validation";
import { Validation } from "../validation/validation";

export class TokoService {
  static async create(user: User, request: CreateTokoRequest): Promise<TokoResponse> {
    const createRequest = Validation.validate(TokoValidation.CREATE, request);

    // 1. Cek apakah user sudah punya toko (cek field toko_id di user)
    if (user.toko_id) {
      throw new ResponseError(400, "You already have a store");
    }

    // 2. Gunakan Transaction: Create Toko -> Lalu Update User
    const result = await prismaClient.$transaction(async (prisma) => {
      // Step A: Buat Tokonya dulu
      const newToko = await prisma.toko.create({
        data: {
          name: createRequest.name,
          description: createRequest.description,
          location: createRequest.location,
          image: createRequest.image,
          // Jangan isi admin_id disini, karena kolomnya tidak ada di schema Toko
        },
      });

      // Step B: Update User supaya terhubung ke Toko yang baru dibuat
      await prisma.user.update({
        where: { id: user.id },
        data: { toko_id: newToko.id },
      });

      return newToko;
    });

    // Step C: Return data toko (manual construct response karena user belum ke-load di object result)
    // Atau kalau mau lengkap bisa fetch ulang, tapi return langsung lebih hemat query
    return toTokoResponse(result);
  }

  static async update(user: User, request: UpdateTokoRequest): Promise<TokoResponse> {
    const updateRequest = Validation.validate(TokoValidation.UPDATE, request);

    // Cek apakah User ini pemilik toko yang mau diedit?
    // Caranya: Cek apakah user.toko_id SAMA DENGAN request.id
    if (user.toko_id !== updateRequest.id) {
      throw new ResponseError(403, "You are not authorized to update this store");
    }

    const toko = await prismaClient.toko.findUnique({
      where: { id: updateRequest.id },
    });

    if (!toko) {
      throw new ResponseError(404, "Store not found");
    }

    const updatedToko = await prismaClient.toko.update({
      where: { id: updateRequest.id },
      data: {
        name: updateRequest.name,
        description: updateRequest.description,
        location: updateRequest.location,
        image: updateRequest.image,
      },
      include: {
        // Karena relasinya Users[] (banyak), kita ambil yg pertama aja atau listnya
        users: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return toTokoResponse(updatedToko);
  }

  static async delete(user: User, tokoId: number): Promise<TokoResponse> {
    // Validasi kepemilikan
    if (user.toko_id !== tokoId) {
      throw new ResponseError(403, "You are not authorized to delete this store");
    }

    const toko = await prismaClient.toko.findUnique({
      where: { id: tokoId },
    });

    if (!toko) {
      throw new ResponseError(404, "Store not found");
    }

    const deletedToko = await prismaClient.toko.delete({
      where: { id: tokoId },
    });

    // Otomatis user.toko_id jadi null di database karena Prisma relation (atau update manual user jika perlu)
    
    return toTokoResponse(deletedToko);
  }

  static async get(tokoId: number): Promise<TokoResponse> {
    const toko = await prismaClient.toko.findUnique({
      where: { id: tokoId },
      include: {
        users: { // Schema kamu pakainya 'users', bukan 'admin'
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

    return toTokoResponse(toko);
  }

  static async getAll(): Promise<TokoResponse[]> {
    const tokos = await prismaClient.toko.findMany({
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return tokos.map((toko) => toTokoResponse(toko));
  }

  static async getMyStore(user: User): Promise<TokoResponse> {
    // Cek user punya toko gak?
    if (!user.toko_id) {
        throw new ResponseError(404, "You don't have a store yet");
    }

    const toko = await prismaClient.toko.findUnique({
      where: {
        id: user.toko_id, // Langsung cari berdasarkan ID yang dipegang user
      },
      include: {
        users: {
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

    return toTokoResponse(toko);
  }
}

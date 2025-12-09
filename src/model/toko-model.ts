import { Toko, User } from "../../generated/prisma/client";

export interface TokoResponse {
    id: number
    name: string
    description: string | null
    location: string | null
    image: string | null

    admin?: {
        id: number
        username: string
        email: string
    }
}

export interface CreateTokoRequest {
    name: string
    description?: string
    location?: string
    image?: string
}

export interface UpdateTokoRequest {
    id: number
    name: string
    description?: string
    location?: string
    image?: string
}

export function toTokoResponse(
    toko: Toko & { admin?: User },
    includeAdmin: boolean = false
): TokoResponse {
    const response: TokoResponse = {
        id: toko.id,
        name: toko.name,
        description: toko.description,
        location: toko.location,
        image: toko.image,

    }

    if (includeAdmin && toko.admin) {
        response.admin = {
            id: toko.admin.id,
            username: toko.admin.username,
            email: toko.admin.email,
        }
    }

    return response
}

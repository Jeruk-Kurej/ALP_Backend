import { Toko } from "../../generated/prisma/client";

export interface TokoResponse {
    id: number;
    name: string;
    description: string | null;
    location: string | null;
    image: string | null;
    is_open: boolean;
    owner?: {
        id: number;
        username: string;
        email: string;
    };
}

export interface CreateTokoRequest {
    name: string;
    description?: string;
    location?: string;
    image?: string;
}

export interface UpdateTokoRequest {
    id: number;
    name: string;
    description?: string;
    location?: string;
    image?: string;
    productIds?: string[] | number[];
}

type TokoWithOwner = Toko & {
    owner?: {
        id: number;
        username: string;
        email: string;
    };
};

export function toTokoResponse(
    toko: TokoWithOwner,
    includeOwner: boolean = false
): TokoResponse {
    const response: TokoResponse = {
        id: toko.id,
        name: toko.name,
        description: toko.description,
        location: toko.location,
        image: toko.image,
        is_open: toko.is_open,
    };

    if (includeOwner && toko.owner) {
        response.owner = {
            id: toko.owner.id,
            username: toko.owner.username,
            email: toko.owner.email,
        };
    }

    return response;
}

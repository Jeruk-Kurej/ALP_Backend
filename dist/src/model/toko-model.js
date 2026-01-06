"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTokoResponse = toTokoResponse;
function toTokoResponse(toko, includeOwner = false) {
    const response = {
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

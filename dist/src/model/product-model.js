"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProductResponse = toProductResponse;
function toProductResponse(product) {
    return {
        id: product.id,
        name: product.name,
        price: product.price.toNumber(),
        description: product.description,
        image: product.image,
        category: {
            id: product.category.id,
            name: product.category.name,
        },
        tokos: product.tokoProducts.map((tp) => ({
            id: tp.toko.id,
            name: tp.toko.name,
        })),
    };
}

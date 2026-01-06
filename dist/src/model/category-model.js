"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCategoryResponse = toCategoryResponse;
function toCategoryResponse(category) {
    return {
        id: category.id,
        name: category.name,
        owner_id: category.owner_id,
    };
}

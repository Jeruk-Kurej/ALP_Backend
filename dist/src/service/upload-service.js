"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const response_error_1 = require("../error/response-error");
class UploadService {
    static async uploadFile(file, baseUrl) {
        if (!file) {
            throw new response_error_1.ResponseError(400, "No file provided!");
        }
        const url = `${baseUrl}/uploads/${file.filename}`;
        return {
            filename: file.filename,
            url: url,
            size: file.size,
            mimetype: file.mimetype,
        };
    }
}
exports.UploadService = UploadService;

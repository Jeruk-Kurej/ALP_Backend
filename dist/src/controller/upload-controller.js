"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const upload_service_1 = require("../service/upload-service");
class UploadController {
    static async uploadFile(req, res, next) {
        try {
            // ✅ Dapatkan base URL dari request
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            const response = await upload_service_1.UploadService.uploadFile(req.file, baseUrl);
            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UploadController = UploadController;

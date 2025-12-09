import { Request, Response, NextFunction } from "express"
import { UploadService, UploadResponse } from "../service/upload-service"
import { ResponseError } from "../error/response-error"

export class UploadController {
    static async uploadFile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // ✅ Dapatkan base URL dari request
            const baseUrl = `${req.protocol}://${req.get("host")}`

            const response = await UploadService.uploadFile(req.file, baseUrl)

            res.status(200).json({
                code: 200,
                status: "OK",
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
}
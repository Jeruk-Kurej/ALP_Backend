import { ResponseError } from "../error/response-error"

export interface UploadResponse {
    filename: string
    url: string
    size: number
    mimetype: string
}

export class UploadService {
    static async uploadFile(
        file: Express.Multer.File | undefined,
        baseUrl: string
    ): Promise<UploadResponse> {
        if (!file) {
            throw new ResponseError(400, "No file provided!")
        }

        const url = `${baseUrl}/uploads/${file.filename}`

        return {
            filename: file.filename,
            url: url,
            size: file.size,
            mimetype: file.mimetype,
        }
    }
}
import multer from "multer"
import { CloudinaryUtil } from "./cloudinary-util"

// Custom storage engine for Cloudinary
class CloudinaryStorage {
    constructor(private cloudinaryFolder: string) {}

    _handleFile(req: any, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {
        console.log('File received:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            hasBuffer: !!file.buffer,
            bufferLength: file.buffer ? file.buffer.length : 0,
            hasStream: !!file.stream
        })

        // Check if file has content
        if (!file.buffer && !file.stream) {
            console.error('No file buffer or stream available')
            return cb(new Error('Empty file or no file content provided'))
        }

        // Use buffer if available, otherwise try to read from stream
        let fileData: Buffer | NodeJS.ReadableStream

        if (file.buffer && file.buffer.length > 0) {
            console.log('Using file buffer for upload, size:', file.buffer.length)
            fileData = file.buffer
        } else if (file.stream) {
            console.log('Using file stream for upload, readable:', file.stream.readable)
            fileData = file.stream
        } else {
            console.error('Neither buffer nor stream available - file details:', {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                hasBuffer: !!file.buffer,
                bufferLength: file.buffer ? file.buffer.length : 0,
                hasStream: !!file.stream,
                streamReadable: file.stream ? (file.stream as any).readable : false
            })
            return cb(new Error('Unable to access file content'))
        }

        // Upload to Cloudinary
        CloudinaryUtil.uploadImage(fileData, `alp_backend/${this.cloudinaryFolder}`)
            .then((result) => {
                console.log('Cloudinary upload success:', result.secure_url)
                // Return multer file info with Cloudinary URL
                const fileInfo: Partial<Express.Multer.File> = {
                    filename: result.public_id,
                    path: result.secure_url,
                    size: result.bytes,
                    mimetype: `image/${result.format}`,
                    originalname: file.originalname,
                }
                cb(null, fileInfo)
            })
            .catch((error) => {
                console.error('Cloudinary upload error:', error)
                cb(error)
            })
    }

    _removeFile(req: any, file: Express.Multer.File, cb: (error: Error | null) => void) {
        cb(null)
    }
}

// File filter (only images)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Only image files are allowed. Server menerima tipe: ${file.mimetype}`), false);
    }
};

export const cloudinaryUpload = multer({
    storage: new CloudinaryStorage('products'),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
})
import multer from "multer"
import { CloudinaryUtil } from "./cloudinary-util"

// Custom storage engine for Cloudinary
class CloudinaryStorage {
    constructor(private cloudinaryFolder: string) {}

    _handleFile(req: any, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {
        // For Cloudinary, we need to handle the file stream
        const uploadOptions = {
            folder: `alp_backend/${this.cloudinaryFolder}`,
            resource_type: 'image' as const,
            transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto' },
            ],
        }

        // Create upload stream
        const uploadStream = CloudinaryUtil.uploadImageStream(uploadOptions)
            .then((result) => {
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

        // Pipe file stream to Cloudinary
        if (file.stream) {
            file.stream.pipe(uploadStream as any)
        } else {
            cb(new Error('File stream not available'))
        }
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
    storage: new CloudinaryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
})
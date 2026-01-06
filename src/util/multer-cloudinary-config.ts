import multer from "multer"
import { CloudinaryUtil } from "./cloudinary-util"

// Custom storage engine for Cloudinary
class CloudinaryStorage {
    constructor(private cloudinaryFolder: string) {}

    _handleFile(req: any, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {
        // Check if file buffer exists
        if (!file.buffer || file.buffer.length === 0) {
            return cb(new Error('Empty file or no file buffer provided'))
        }

        // Upload to Cloudinary
        CloudinaryUtil.uploadImage(file.buffer, `alp_backend/${this.cloudinaryFolder}`)
            .then((result) => {
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
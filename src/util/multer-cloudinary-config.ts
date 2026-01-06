import multer from "multer"
import { CloudinaryUtil } from "./cloudinary-util"

// Custom storage engine for Cloudinary
class CloudinaryStorage {
    _handleFile(req: any, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {
        // Convert file buffer to Cloudinary upload
        CloudinaryUtil.uploadImage(file.buffer, 'alp_backend')
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
                cb(error)
            })
    }

    _removeFile(req: any, file: Express.Multer.File, cb: (error: Error | null) => void) {
        // Optional: implement file removal if needed
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
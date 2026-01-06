import multer from "multer"
import path from "path"
import fs from "fs"
import { CloudinaryUtil } from "./cloudinary-util"

/**
 * Helper function to ensure directory exists
 * @param dirPath - Path to directory
 */
const ensureDir = (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}

/**
 * Create multer storage configuration for specific folder
 * @param uploadFolder - Relative path from public folder (e.g., 'uploads/tokos', 'uploads/products')
 */
const createStorage = (uploadFolder: string): multer.StorageEngine => {
    const uploadsDir = path.join(process.cwd(), "public", uploadFolder)
    ensureDir(uploadsDir)

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir)
        },
        filename: (req, file, cb) => {
            const allowedExtensions: { [key: string]: string } = {
                "image/jpeg": ".jpg",
                "image/jpg": ".jpg",
                "image/png": ".png",
                "image/gif": ".gif",
                "image/webp": ".webp",
            }

            const ext = allowedExtensions[file.mimetype] || path.extname(file.originalname)
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
            cb(null, uniqueName)
        },
    })
}

/**
 * Create Cloudinary storage for specific folder
 * @param folder - Cloudinary folder name (e.g., 'tokos', 'products')
 */
class CloudinaryStorage {
    constructor(private cloudinaryFolder: string) {}

    _handleFile(req: any, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {
        // Convert file buffer to Cloudinary upload
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
                cb(error)
            })
    }

    _removeFile(req: any, file: Express.Multer.File, cb: (error: Error | null) => void) {
        // Optional: implement file removal if needed
        cb(null)
    }
}

/**
 * File filter to accept only images
 */
const imageFileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
    ]

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(
            new Error(
                `Only image files are allowed. Received type: ${file.mimetype}`
            )
        )
    }
}

/**
 * Upload configuration for Toko images using Cloudinary
 * Stores files in: alp_backend/tokos/
 */
export const uploadToko = multer({
    storage: new CloudinaryStorage("tokos"),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
})

/**
 * Upload configuration for Product images using Cloudinary
 * Stores files in: alp_backend/products/
 */
export const uploadProduct = multer({
    storage: new CloudinaryStorage("products"),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
})

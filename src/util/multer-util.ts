import multer from "multer"
import path from "path"
import fs from "fs"

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
 * Upload configuration for Toko images
 * Stores files in: public/uploads/tokos/
 */
export const uploadToko = multer({
    storage: createStorage("uploads/tokos"),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
})

/**
 * Upload configuration for Product images
 * Stores files in: public/uploads/products/
 */
export const uploadProduct = multer({
    storage: createStorage("uploads/products"),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
})

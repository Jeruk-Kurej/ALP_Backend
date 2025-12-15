import multer from "multer"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../public/uploads")
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        // Generate unique filename: uuid + original extension
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    },
})

// File filter (only images)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {

    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Only image files are allowed. Server menerima tipe: ${file.mimetype}`), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
})
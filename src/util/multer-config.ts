import multer from "multer"
import path from "path"
import fs from "fs"

// Buat folder uploads jika belum ada
const uploadsDir = path.join(process.cwd(), "public", "uploads")
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// Konfigurasi storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        // ✅ Rename file: timestamp + original extension
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    },
})

// Filter file - hanya gambar
const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/jpg"]
    const allowedExtensions = [".jpg", ".jpeg", ".png"]

    const ext = path.extname(file.originalname).toLowerCase()
    const mime = file.mimetype

    if (allowedMimes.includes(mime) && allowedExtensions.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Only JPG, JPEG, and PNG files are allowed!"))
    }
}

// Konfigurasi multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
})
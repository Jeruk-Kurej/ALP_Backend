import { NextFunction, Request, Response } from "express"
import { ResponseError } from "../error/response-error"
import multer from "multer"
import path from "path"
import fs from "fs"

const uploadsDir = path.join(process.cwd(), "public", "uploads")
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        const allowedExtensions: { [key: string]: string } = {
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/png": ".png",
        }

        const ext = allowedExtensions[file.mimetype] || ".jpg"
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
        cb(null, uniqueName)
    },
})

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/jpg"]

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only JPG, JPEG, and PNG files are allowed!"))
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
})

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                code: 400,
                status: "BAD_REQUEST",
                errors: "File size is too large! Maximum 5MB.",
            })
        }
        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                code: 400,
                status: "BAD_REQUEST",
                errors: "Too many files!",
            })
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                code: 400,
                status: "BAD_REQUEST",
                errors: "Unexpected field name!",
            })
        }
        // Default multer error
        return res.status(400).json({
            code: 400,
            status: "BAD_REQUEST",
            errors: error.message,
        })
    }

    // Handle custom file filter errors
    if (error instanceof Error && error.message.includes("Only JPG")) {
        return res.status(400).json({
            code: 400,
            status: "BAD_REQUEST",
            errors: error.message,
        })
    }

    // Handle ResponseError
    if (error instanceof ResponseError) {
        return res.status(error.status).json({
            code: error.status,
            status: "BAD_REQUEST",
            errors: error.message,
        })
    }

    // Default error
    return res.status(500).json({
        code: 500,
        status: "INTERNAL_SERVER_ERROR",
        errors: error.message || "Internal server error",
    })
}
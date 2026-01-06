import { NextFunction, Request, Response } from "express"
import { ResponseError } from "../error/response-error"
import multer from "multer"

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
    if (error instanceof Error && error.message.includes("Only image")) {
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
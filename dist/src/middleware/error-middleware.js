"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const response_error_1 = require("../error/response-error");
const multer_1 = __importDefault(require("multer"));
const errorMiddleware = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                code: 400,
                status: "BAD_REQUEST",
                errors: "File size is too large! Maximum 5MB.",
            });
        }
        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                code: 400,
                status: "BAD_REQUEST",
                errors: "Too many files!",
            });
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                code: 400,
                status: "BAD_REQUEST",
                errors: "Unexpected field name!",
            });
        }
        // Default multer error
        return res.status(400).json({
            code: 400,
            status: "BAD_REQUEST",
            errors: error.message,
        });
    }
    // Handle custom file filter errors
    if (error instanceof Error && error.message.includes("Only image")) {
        return res.status(400).json({
            code: 400,
            status: "BAD_REQUEST",
            errors: error.message,
        });
    }
    // Handle ResponseError
    if (error instanceof response_error_1.ResponseError) {
        return res.status(error.status).json({
            code: error.status,
            status: "BAD_REQUEST",
            errors: error.message,
        });
    }
    // Default error
    return res.status(500).json({
        code: 500,
        status: "INTERNAL_SERVER_ERROR",
        errors: error.message || "Internal server error",
    });
};
exports.errorMiddleware = errorMiddleware;

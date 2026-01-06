"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.upload = void 0;
const response_error_1 = require("../error/response-error");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadsDir = path_1.default.join(process.cwd(), "public", "uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const allowedExtensions = {
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/png": ".png",
        };
        const ext = allowedExtensions[file.mimetype] || ".jpg";
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, JPEG, and PNG files are allowed!"));
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
});
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
    if (error instanceof Error && error.message.includes("Only JPG")) {
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

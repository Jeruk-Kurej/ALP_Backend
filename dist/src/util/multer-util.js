"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProduct = exports.uploadToko = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Helper function to ensure directory exists
 * @param dirPath - Path to directory
 */
const ensureDir = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
/**
 * Create multer storage configuration for specific folder
 * @param uploadFolder - Relative path from public folder (e.g., 'uploads/tokos', 'uploads/products')
 */
const createStorage = (uploadFolder) => {
    const uploadsDir = path_1.default.join(process.cwd(), "public", uploadFolder);
    ensureDir(uploadsDir);
    return multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const allowedExtensions = {
                "image/jpeg": ".jpg",
                "image/jpg": ".jpg",
                "image/png": ".png",
                "image/gif": ".gif",
                "image/webp": ".webp",
            };
            const ext = allowedExtensions[file.mimetype] || path_1.default.extname(file.originalname);
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            cb(null, uniqueName);
        },
    });
};
/**
 * File filter to accept only images
 */
const imageFileFilter = (req, file, cb) => {
    const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Only image files are allowed. Received type: ${file.mimetype}`));
    }
};
/**
 * Upload configuration for Toko images
 * Stores files in: public/uploads/tokos/
 */
exports.uploadToko = (0, multer_1.default)({
    storage: createStorage("uploads/tokos"),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
});
/**
 * Upload configuration for Product images
 * Stores files in: public/uploads/products/
 */
exports.uploadProduct = (0, multer_1.default)({
    storage: createStorage("uploads/products"),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
});

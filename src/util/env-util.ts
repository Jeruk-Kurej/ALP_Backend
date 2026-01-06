import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

// Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
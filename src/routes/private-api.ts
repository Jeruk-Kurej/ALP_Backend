import express from "express"
import { authMiddleware } from "../middleware/auth-middleware"
import uploadRouter from "./upload-api"
import productRouter from "./product-api"

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)

privateRouter.use(uploadRouter)
privateRouter.use(productRouter)


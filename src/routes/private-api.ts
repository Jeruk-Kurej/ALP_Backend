import express from "express"
import { authMiddleware } from "../middleware/auth-middleware"

import uploadRouter from "./upload-api"
import productRouter from "./product-api"
import { categoryRouter } from "./category-api"
import { paymentRouter } from "./payment-api"
import { tokoRouter } from "./toko-api"
import { orderRouter } from "./order-api"

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)

privateRouter.use(uploadRouter)
privateRouter.use(productRouter)
privateRouter.use(categoryRouter)
privateRouter.use(paymentRouter)
privateRouter.use(tokoRouter)
privateRouter.use(orderRouter)


import express from "express"
import { TokoController } from "../controller/toko-controller"
import { authMiddleware } from "../middleware/auth-middleware"

export const tokoRouter = express.Router()

// Public routes
tokoRouter.get("/:tokoId", TokoController.get)
tokoRouter.get("/", TokoController.getAll)

// Protected routes
tokoRouter.use(authMiddleware)
tokoRouter.post("/", TokoController.create)
tokoRouter.get("/my/store", TokoController.getMyStore)
tokoRouter.put("/:tokoId", TokoController.update)
tokoRouter.delete("/:tokoId", TokoController.delete)
import express from "express"
import { TokoController } from "../controller/toko-controller"
import { cloudinaryUpload } from "../util/multer-cloudinary-config"

export const tokoRouter = express.Router()

tokoRouter.post("/tokos", cloudinaryUpload.single("image"), TokoController.create)
tokoRouter.put("/tokos/:tokoId", cloudinaryUpload.single("image"), TokoController.update)
tokoRouter.get("/tokos/my/stores", TokoController.getMyStores)
tokoRouter.delete("/tokos/:tokoId", TokoController.delete)
tokoRouter.get("/tokos/:tokoId", TokoController.get)
tokoRouter.get("/tokos", TokoController.getAll)
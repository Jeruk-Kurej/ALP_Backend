import express from "express"
import { TokoController } from "../controller/toko-controller"
import { cloudinaryUploadToko } from "../util/multer-cloudinary-config"

export const tokoRouter = express.Router()

tokoRouter.post("/tokos", cloudinaryUploadToko.single("image"), TokoController.create)
tokoRouter.put("/tokos/:tokoId", cloudinaryUploadToko.single("image"), TokoController.update)
tokoRouter.get("/tokos/my/stores", TokoController.getMyStores)
tokoRouter.delete("/tokos/:tokoId", TokoController.delete)
tokoRouter.get("/tokos/:tokoId", TokoController.get)
tokoRouter.get("/tokos", TokoController.getAll)
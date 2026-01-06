import express from "express"
import { TokoController } from "../controller/toko-controller"
import { uploadToko } from "../util/multer-util"  

export const tokoRouter = express.Router()

tokoRouter.post("/tokos", uploadToko.single("image"), TokoController.create)
tokoRouter.put("/tokos/:tokoId", uploadToko.single("image"), TokoController.update)
tokoRouter.get("/tokos/my/stores", TokoController.getMyStores)
tokoRouter.delete("/tokos/:tokoId", TokoController.delete)
tokoRouter.get("/tokos/:tokoId", TokoController.get)
tokoRouter.get("/tokos", TokoController.getAll)
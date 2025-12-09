import express from "express"
import { TokoController } from "../controller/toko-controller"

export const tokoRouter = express.Router()

tokoRouter.post("/tokos", TokoController.create)
tokoRouter.get("/tokos/my/stores", TokoController.getMyStores)
tokoRouter.put("/tokos/:tokoId", TokoController.update)
tokoRouter.delete("/tokos/:tokoId", TokoController.delete)
tokoRouter.get("/tokos/:tokoId", TokoController.get)
tokoRouter.get("/tokos", TokoController.getAll)
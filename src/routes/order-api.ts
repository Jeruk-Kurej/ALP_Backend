import express from "express"
import { OrderController } from "../controller/order-controller"

export const orderRouter = express.Router()

orderRouter.post("/orders", OrderController.create)
orderRouter.get("/orders", OrderController.getAll)
orderRouter.get("/orders/toko/:tokoId", OrderController.getAllByToko)
orderRouter.get("/orders/:id", OrderController.getById)
orderRouter.put("/orders/:id/status", OrderController.updateStatus)  
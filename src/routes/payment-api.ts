import express from "express"
import { PaymentController } from "../controller/payment-controller"

export const paymentRouter = express.Router()

paymentRouter.post("/payments", PaymentController.create)
paymentRouter.put("/payments/:paymentId", PaymentController.update)
paymentRouter.delete("/payments/:paymentId", PaymentController.delete)
paymentRouter.get("/payments/:paymentId", PaymentController.get)
paymentRouter.get("/payments", PaymentController.getAll)
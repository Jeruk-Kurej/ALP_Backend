import express from "express";
import { PaymentController } from "../controller/payment-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export const paymentRouter = express.Router();

paymentRouter.use(authMiddleware);
paymentRouter.post("/", PaymentController.create);
paymentRouter.put("/:paymentId", PaymentController.update);
paymentRouter.delete("/:paymentId", PaymentController.delete);
paymentRouter.get("/:paymentId", PaymentController.get);
paymentRouter.get("/", PaymentController.getAll);
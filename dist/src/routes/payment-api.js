"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controller/payment-controller");
exports.paymentRouter = express_1.default.Router();
exports.paymentRouter.post("/payments", payment_controller_1.PaymentController.create);
exports.paymentRouter.put("/payments/:paymentId", payment_controller_1.PaymentController.update);
exports.paymentRouter.delete("/payments/:paymentId", payment_controller_1.PaymentController.delete);
exports.paymentRouter.get("/payments/:paymentId", payment_controller_1.PaymentController.get);
exports.paymentRouter.get("/payments", payment_controller_1.PaymentController.getAll);

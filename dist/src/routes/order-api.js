"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controller/order-controller");
exports.orderRouter = express_1.default.Router();
exports.orderRouter.post("/orders", order_controller_1.OrderController.create);
exports.orderRouter.get("/orders", order_controller_1.OrderController.getAll);
exports.orderRouter.get("/orders/toko/:tokoId", order_controller_1.OrderController.getAllByToko);
exports.orderRouter.get("/orders/:id", order_controller_1.OrderController.getById);
exports.orderRouter.put("/orders/:id/status", order_controller_1.OrderController.updateStatus);

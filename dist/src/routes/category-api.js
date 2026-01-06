"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controller/category-controller");
exports.categoryRouter = express_1.default.Router();
exports.categoryRouter.post("/categories", category_controller_1.CategoryController.create);
exports.categoryRouter.put("/categories/:categoryId", category_controller_1.CategoryController.update);
exports.categoryRouter.delete("/categories/:categoryId", category_controller_1.CategoryController.delete);
exports.categoryRouter.get("/categories/:categoryId", category_controller_1.CategoryController.get);
exports.categoryRouter.get("/categories", category_controller_1.CategoryController.getAll);

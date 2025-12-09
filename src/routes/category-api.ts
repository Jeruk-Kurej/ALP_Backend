import express from "express";
import { CategoryController } from "../controller/category-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export const categoryRouter = express.Router();

categoryRouter.use(authMiddleware);
categoryRouter.post("/", CategoryController.create);
categoryRouter.put("/:categoryId", CategoryController.update);
categoryRouter.delete("/:categoryId", CategoryController.delete);
categoryRouter.get("/:categoryId", CategoryController.get);
categoryRouter.get("/", CategoryController.getAll);
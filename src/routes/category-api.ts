import express from "express"
import { CategoryController } from "../controller/category-controller"

export const categoryRouter = express.Router()

categoryRouter.post("/categories", CategoryController.create)
categoryRouter.put("/categories/:categoryId", CategoryController.update)
categoryRouter.delete("/categories/:categoryId", CategoryController.delete)
categoryRouter.get("/categories/:categoryId", CategoryController.get)
categoryRouter.get("/categories", CategoryController.getAll)
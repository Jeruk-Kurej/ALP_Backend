import { Router } from "express"
import { ProductController } from "../controller/product-controller"

const productRouter = Router()

productRouter.post("/products", ProductController.create)
productRouter.put("/products/:id", ProductController.update)
productRouter.delete("/products/:id", ProductController.delete)
productRouter.get("/products/:id", ProductController.getById)
productRouter.get("/products", ProductController.getAll)

export default productRouter

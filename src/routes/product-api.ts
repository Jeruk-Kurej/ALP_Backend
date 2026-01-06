import { Router } from "express"
import { ProductController } from "../controller/product-controller"
import { uploadProduct } from "../util/multer-util"  

const productRouter = Router()

productRouter.post("/products", uploadProduct.single("image"), ProductController.create)
productRouter.put("/products/:id", uploadProduct.single("image"), ProductController.update)
productRouter.delete("/products/:id", ProductController.delete)
productRouter.get("/products/:id", ProductController.getById)
productRouter.get("/products", ProductController.getAll)

export default productRouter

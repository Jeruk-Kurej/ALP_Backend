import { Router } from "express"
import { ProductController } from "../controller/product-controller"
import { upload } from "../util/multer-config"  

const productRouter = Router()

productRouter.post("/products", upload.single("image"), ProductController.create)
productRouter.put("/products/:id", upload.single("image"), ProductController.update)
productRouter.delete("/products/:id", ProductController.delete)
productRouter.get("/products/:id", ProductController.getById)
productRouter.get("/products", ProductController.getAll)

export default productRouter

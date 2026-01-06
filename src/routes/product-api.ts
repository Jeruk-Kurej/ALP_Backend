import { Router } from "express"
import { ProductController } from "../controller/product-controller"
import { cloudinaryUpload } from "../util/multer-cloudinary-config"

const productRouter = Router()

productRouter.post("/products", cloudinaryUpload.single("image"), ProductController.create)
productRouter.put("/products/:id", cloudinaryUpload.single("image"), ProductController.update)
productRouter.delete("/products/:id", ProductController.delete)
productRouter.get("/products/:id", ProductController.getById)
productRouter.get("/products", ProductController.getAll)

export default productRouter

import { Router } from "express"
import { ProductController } from "../controller/product-controller"

const router = Router()

router.post("/products", ProductController.create)
router.get("/products", ProductController.getAll)
router.get("/products/:id", ProductController.getById)
router.put("/products/:id", ProductController.update)
router.delete("/products/:id", ProductController.delete)

export default router

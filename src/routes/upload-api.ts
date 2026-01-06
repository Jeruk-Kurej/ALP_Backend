import { Router } from "express"
import { UploadController } from "../controller/upload-controller"
import { uploadProduct } from "../util/multer-util"

const router = Router()

router.post("/upload", uploadProduct.single("file"), UploadController.uploadFile)

export default router
import { Router } from "express"
import { UploadController } from "../controller/upload-controller"
import { upload } from "../util/multer-config"

const router = Router()

router.post("/upload",upload.single("file"), UploadController.uploadFile)

export default router
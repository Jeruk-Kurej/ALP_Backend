"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controller/upload-controller");
const multer_config_1 = require("../util/multer-config");
const router = (0, express_1.Router)();
router.post("/upload", multer_config_1.upload.single("file"), upload_controller_1.UploadController.uploadFile);
exports.default = router;

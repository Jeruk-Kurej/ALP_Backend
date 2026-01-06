"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokoRouter = void 0;
const express_1 = __importDefault(require("express"));
const toko_controller_1 = require("../controller/toko-controller");
const multer_config_1 = require("../util/multer-config");
exports.tokoRouter = express_1.default.Router();
exports.tokoRouter.post("/tokos", multer_config_1.upload.single("image"), toko_controller_1.TokoController.create);
exports.tokoRouter.put("/tokos/:tokoId", multer_config_1.upload.single("image"), toko_controller_1.TokoController.update);
exports.tokoRouter.get("/tokos/my/stores", toko_controller_1.TokoController.getMyStores);
exports.tokoRouter.delete("/tokos/:tokoId", toko_controller_1.TokoController.delete);
exports.tokoRouter.get("/tokos/:tokoId", toko_controller_1.TokoController.get);
exports.tokoRouter.get("/tokos", toko_controller_1.TokoController.getAll);

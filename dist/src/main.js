"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const env_util_1 = require("./util/env-util");
const public_api_1 = require("./routes/public-api");
const private_api_1 = require("./routes/private-api");
const error_middleware_1 = require("./middleware/error-middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../public/uploads")));
app.use("/api", public_api_1.publicRouter);
app.use("/api", private_api_1.privateRouter);
app.use(error_middleware_1.errorMiddleware);
app.listen(env_util_1.PORT || 3000, () => {
    console.log(`Connected to port ${env_util_1.PORT}`);
});

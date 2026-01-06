"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_util_1 = require("./env-util");
const generateToken = (payload, expiryTime = "1h") => {
    return jsonwebtoken_1.default.sign(payload, env_util_1.JWT_SECRET_KEY || "secret_key", {
        expiresIn: expiryTime,
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_util_1.JWT_SECRET_KEY || "secret_key");
};
exports.verifyToken = verifyToken;

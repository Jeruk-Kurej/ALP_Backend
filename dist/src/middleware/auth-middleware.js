"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const response_error_1 = require("../error/response-error");
const jwt_util_1 = require("../util/jwt-util");
const database_util_1 = require("../util/database-util");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return next(new response_error_1.ResponseError(401, "Unauthorized user!"));
        }
        const payload = (0, jwt_util_1.verifyToken)(token);
        const user = await database_util_1.prismaClient.user.findUnique({
            where: { id: payload.id }
        });
        if (!user) {
            return next(new response_error_1.ResponseError(401, "User not found!"));
        }
        if (!user.is_active) {
            return next(new response_error_1.ResponseError(403, "Account is inactive!"));
        }
        req.user = payload;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;

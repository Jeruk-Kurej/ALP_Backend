"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../service/user-service");
class UserController {
    static async register(req, res, next) {
        try {
            const request = req.body;
            const response = await user_service_1.UserService.register(request);
            res.status(200).json({
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const request = req.body;
            const response = await user_service_1.UserService.login(request);
            res.status(200).json({
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const response_error_1 = require("../error/response-error");
const user_model_1 = require("../model/user-model");
const database_util_1 = require("../util/database-util");
const user_validation_1 = require("../validation/user-validation");
const validation_1 = require("../validation/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    static async register(request) {
        const validatedData = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
        const email = await database_util_1.prismaClient.user.findFirst({
            where: {
                email: validatedData.email,
            },
        });
        if (email) {
            throw new response_error_1.ResponseError(400, "Email has already existed!");
        }
        validatedData.password = await bcrypt_1.default.hash(validatedData.password, 12);
        const user = await database_util_1.prismaClient.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                password: validatedData.password,
            },
        });
        return (0, user_model_1.toUserResponse)(user.id, user.username, user.email);
    }
    static async login(request) {
        const validatedData = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, request);
        const user = await database_util_1.prismaClient.user.findFirst({
            where: { username: request.username },
        });
        if (!user) {
            throw new response_error_1.ResponseError(400, "Invalid email or password!");
        }
        if (!user.is_active) {
            throw new response_error_1.ResponseError(403, "Account is inactive!");
        }
        const passwordIsValid = await bcrypt_1.default.compare(validatedData.password, user.password);
        if (!passwordIsValid) {
            throw new response_error_1.ResponseError(400, "Invalid email or password!");
        }
        return (0, user_model_1.toUserResponse)(user.id, user.username, user.email);
    }
}
exports.UserService = UserService;

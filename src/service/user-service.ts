import { ResponseError } from "../error/response-error"
import {
    LoginUserRequest,
    RegisterUserRequest,
    toUserResponse,
    UserResponse,
} from "../model/user-model"
import { prismaClient } from "../util/database-util"
import { UserValidation } from "../validation/user-validation"
import { Validation } from "../validation/validation"
import bcrypt from "bcrypt"

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(
            UserValidation.REGISTER,
            request
        )

        const email = await prismaClient.user.findFirst({
            where: {
                email: validatedData.email,
            },
        })

        if (email) {
            throw new ResponseError(400, "Email has already existed!")
        }

        validatedData.password = await bcrypt.hash(validatedData.password, 12)

        const user = await prismaClient.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                password: validatedData.password,
            },
        })

        return toUserResponse(user.id, user.username, user.email)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(UserValidation.LOGIN, request)

        const user = await prismaClient.user.findFirst({
            where: { username: request.username },
        })

        if (!user) {
            throw new ResponseError(400, "Invalid email or password!")
        }

        if (!user.is_active) {
            throw new ResponseError(403, "Account is inactive!")
        }

        const passwordIsValid = await bcrypt.compare(
            validatedData.password,
            user.password
        )

        if (!passwordIsValid) {
            throw new ResponseError(400, "Invalid email or password!")
        }

        return toUserResponse(user.id, user.username, user.email)
    }
}
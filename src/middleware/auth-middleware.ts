import { NextFunction, Response } from "express"
import { UserRequest } from "../model/user-request-model"
import { ResponseError } from "../error/response-error"
import { verifyToken } from "../util/jwt-util"
import { prismaClient } from "../util/database-util"

export const authMiddleware = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1]

        if (!token) {
            return next(new ResponseError(401, "Unauthorized user!"))
        }

        const payload = verifyToken(token)

        const user = await prismaClient.user.findUnique({
            where: { id: payload.id }
        })

        if (!user) {
            return next(new ResponseError(401, "User not found!"))
        }

        if (!user.is_active) {
            return next(new ResponseError(403, "Account is inactive!"))
        }

        req.user = payload
        next()
    } catch (error) {
        next(error)
    }
}
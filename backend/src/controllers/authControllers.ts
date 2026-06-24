import type { FastifyReply, FastifyRequest } from "fastify";
import { authSchema } from "../validationSchemas/index.js";
import { loginUserService, registerUserService } from "../services/authService.js";
import { AppError } from "../helpers/error.js";


export const registerController = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const payload = authSchema.parse(request.body);
        const response = await registerUserService(payload);

        console.log({ response });

        return reply.status(201).send({
            success: true,
            data: response,
            message: "User Registered successfully"
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            throw new AppError(error.statusCode, error.code, error.message);
        }
    }
}

export const loginController = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const payload = authSchema.parse(request.body);
        const response = await loginUserService(payload);

        return reply.status(200).send({
            success: true,
            data: response,
            message: "User logged In successfully"
        });
    } catch (error: any) {
        throw new AppError(500, 'SERVER_ERROR', `${error.message}`);
    }
}
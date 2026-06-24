import type { FastifyReply, FastifyRequest } from "fastify";
import { initiateUploadService, completeUploadService } from "../services/uploadService.js";
import { AppError } from "../helpers/error.js";
import { uploadFileSchema } from "../validationSchemas/index.js";


export const initiateUploadController = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const payload = uploadFileSchema.parse(request.body);
        const user: any = request.user;
        const response = await initiateUploadService(payload, user.id);

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

export const completeUploadController = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const user: any = request.user;
        const params: any = request?.params;
        const response = await completeUploadService(params.id, user.id);

        return reply.status(200).send({
            success: true,
            data: response,
            message: "User logged In successfully"
        });
    } catch (error: any) {
        throw new AppError(500, 'SERVER_ERROR', `${error.message}`);
    }
}
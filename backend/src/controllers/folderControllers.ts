import type { FastifyReply, FastifyRequest } from "fastify";
import {
  getRootFolderService,
  getSingleFolderService,
  createFolderService,
  deleteFolderService,
  deleteFileService,
} from "../services/index.js";
import {
  createFolderSchema,
} from "../validationSchemas/index.js";
import { AppError } from "../helpers/error.js";

export const getRootFolderController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user: any = request.user;
    const response = await getRootFolderService(user?.id);

    return reply.status(200).send({
      success: true,
      data: response,
      message: "Root folders retrieved successfully",
    });
  } catch (error: any) {
    throw new AppError(500, 'SERVER_ERROR', `${error.message}`);
  }
};

export const getFolderController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const params: any = request?.params;
    const user: any = request.user;
    const response = await getSingleFolderService(params.id, user.id);

    return reply.status(200).send({
      success: true,
      data: response,
      message: "Folder retrieved successfully",
    });
  } catch (error: any) {
    throw new AppError(500, 'SERVER_ERROR', `${error.message}`);
  }
};

export const createFolderController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const payload = createFolderSchema.parse(request.body);
    const user: any = request.user;
    const response = await createFolderService(payload, user.id);

    return reply.status(201).send({
      success: true,
      data: response,
      message: "Folder created successfully",
    });
  } catch (error: any) {
    throw new AppError(500, 'SERVER_ERROR', `${error.message}`);
  }
};

export const deleteFolderController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const params: any = request?.params;
    const user: any = request.user;
    await deleteFolderService(params.id, user.id);

    return reply.status(200).send({
      success: true,
      data: null,
      message: "Folder deleted successfully",
    });
  } catch (error: any) {
    throw new AppError(500, 'SERVER_ERROR', `${error.message}`);
  }
};

export const deleteFileController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const params: any = request?.params;
    const user: any = request.user;
    await deleteFileService(params.id, user.id);

    return reply.status(200).send({
      success: true,
      data: null,
      message: "File deleted successfully",
    });
  } catch (error: any) {
    throw new AppError(500, 'SERVER_ERROR', `${error.message}`);
  }
};
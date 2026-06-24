import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth-routes.js";
import { folderRoutes } from "./folder-routes.js";
import { uploadRoutes } from "./upload-routes.js";


export const apiRoutes = async (app: FastifyInstance) => {
    await app.register(authRoutes);
    await app.register(folderRoutes);
    await app.register(uploadRoutes);
}
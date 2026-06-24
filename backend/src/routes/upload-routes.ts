import type { FastifyInstance } from "fastify";
import { initiateUploadController, completeUploadController } from "../controllers/uploadController.js";


export const uploadRoutes = (app: FastifyInstance) => {
    app.post('/uploads/init', initiateUploadController);
    app.post('/uploads/:id/complete', completeUploadController);
}
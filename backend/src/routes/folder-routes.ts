import type { FastifyInstance } from "fastify";
import { 
    getRootFolderController, 
    getFolderController,
    createFolderController,
    deleteFolderController,
    deleteFileController
} from "../controllers/index.js";
import { validateToken } from "../middlewares/auth-middleware.js";


export const folderRoutes = (app: FastifyInstance) => {
    app.get('/folders', { preHandler: validateToken }, getRootFolderController);
    app.get('/folders/:id', { preHandler: validateToken }, getFolderController);
    app.post('/folders', { preHandler: validateToken }, createFolderController);
    app.delete('/folders/:id', { preHandler: validateToken }, deleteFolderController);
    app.delete('/file/:id', { preHandler: validateToken }, deleteFileController);
}
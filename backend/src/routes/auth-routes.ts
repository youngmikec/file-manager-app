import type { FastifyInstance } from "fastify";
import { loginController, registerController } from "../controllers/authControllers.js";


export const authRoutes = (app: FastifyInstance) => {
    app.post('/auth/login', loginController);
    app.post('/auth/register', registerController);
}
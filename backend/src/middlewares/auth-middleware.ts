import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../config/db/client.js";
import { verifyAccessToken } from "../helpers/password.js";

const normalizeAuthToken = (authToken: string | undefined): string => {
    if (!authToken || !authToken.startsWith('Bearer ')) {
      return '';
    }
    const token = authToken.split(' ')[1] as string;
    return token;
}

export async function validateToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authToken = request.headers.authorization;

    const token = normalizeAuthToken(authToken);
    if (token === '') {
        reply.status(401).send({
            status: false,
            message: 'Missing or invalid token',
            data: null,
        });
    }
    const decodedToken: any = verifyAccessToken(token);
    const userId = decodedToken?.user.id;
    const expiresAt = decodedToken?.exp;
    const isExpired = expiresAt < Math.floor(Date.now() / 1000);

    if (isExpired) {
        reply.status(403).send({ 
            success: false,
            data: null,
            message: 'Token Expired' 
        });
    }
    
    if (decodedToken.type !== 'access') {
    }
    const user = await prisma.user.findUnique({ where: { id: userId }});

    if (!user) {
      reply.status(401).send({ 
        success: false,
        data: null,
        message: 'User not found' 
    });
      return;
    }

    request.user =  user;
  } catch (err) {
    reply.status(401).send({
      status: false,
      message: 'Invalid token',
      data: null,
    });
    return; // Exit after sending error response
  }
}
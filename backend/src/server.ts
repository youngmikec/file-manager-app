import Fastify from "fastify";
import jwt from "@fastify/jwt";
import rawBody from "fastify-raw-body";
import cors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import { env } from './config/env.js';
import { apiRoutes } from "./routes/index.js";
import { AppError } from "./helpers/error.js";
import { ZodError } from "zod";
import { ensureBucketExists } from "./helpers/minio-storage.js";

const app = Fastify({ logger: true });

app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: `${env.JWT_ACCESS_TTL_MINUTES}m` }
});

app.register(rawBody, {
  field: "rawBody",
  global: false,
  encoding: "utf8",
  runFirst: true
});

app.register(fastifyHelmet, { contentSecurityPolicy: false });
app.register(cors, {
  origin: env.CORS_ORIGINS_LIST.length > 0 ? env.CORS_ORIGINS_LIST : false,
  methods: env.CORS_METHODS_LIST.length > 0 ? env.CORS_METHODS_LIST : '',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.register(apiRoutes, { prefix: "/api" });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      code: "NOT_FOUND",
      message: "Route not found",
      requestId: request.id
    });
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      const flattened = error.flatten();
      const firstFieldError = Object.values(flattened.fieldErrors).flat()[0];
      const message = firstFieldError ? `Validation error: ${firstFieldError}` : "Validation error";
      return reply.status(400).send({
        sucess: false,
        data: null,
        code: "VALIDATION_ERROR",
        message,
        details: flattened,
        requestId: request.id
      });
    }

    // Known application errors — safe to expose message
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        sucess: false,
        data: null,
        // code: error.code,
        // requestId: request.id
        message: error.message,
      });
    }


    app.log.error({ err: error });
    const statusCode = typeof (error as { statusCode?: number }).statusCode === "number"
      ? (error as { statusCode?: number }).statusCode ?? 500
      : 500;
    const message = error instanceof Error ? error.message : "Unexpected error";
    reply.status(statusCode).send({
      code: statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
      message: statusCode >= 500 ? "Internal server error" : message,
      requestId: request.id
    });
  });

  await ensureBucketExists();

app
  .listen({ host: env.HOST, port: env.PORT })
  .then(() => {
    console.log(`🚀 Server started on http://${env.HOST}:${env.PORT}`);
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

export default app;
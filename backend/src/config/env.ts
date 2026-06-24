import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(5000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  //   TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(1),
  CORS_ORIGINS: z.string().default(""),
  CORS_METHODS_LIST: z.string().default(""),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_TTL_MINUTES: z.coerce.number().int().positive().default(10),
  JWT_SECRET: z.string().min(16),
  MINIO_ENDPOINT: z.string().default(""),
  MINIO_PORT: z.coerce.number().int().positive().default(9000),
  MINIO_ACCESS_KEY: z.string().default(''),
  MINIO_SECRET_KEY: z.string().default(''),
  MINIO_BUCKET: z.string().default(''),
  MINIO_USE_SSL: z.string().default('false'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Avoid logging full env; only expose validation errors.
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const corsOrigins = parsed.data.CORS_ORIGINS
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

const corsMethods = parsed.data.CORS_METHODS_LIST.split(',').map((method) => method.trim());

export const env = {
  ...parsed.data,
  CORS_ORIGINS_LIST: corsOrigins,
  CORS_METHODS_LIST: corsMethods,
};

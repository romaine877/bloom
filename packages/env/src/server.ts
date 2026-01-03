import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "staging"]).default("development"),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_PUBLISHABLE_KEY: z.string().min(1),
   CLERK_WEBHOOK_SECRET: z.string().min(1),
    PORT: z.number().default(3000),
    HOST: z.string().default("0.0.0.0"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

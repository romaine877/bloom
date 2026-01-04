import { env } from "@bloom-app/env/server";
import fastifyCors from "@fastify/cors";
import Fastify from "fastify";

import {
  DrizzleUserRepository,
  DrizzleUserProfileRepository,
  DrizzleCycleLogRepository,
  DrizzleMoodLogRepository,
  DrizzleSymptomLogRepository,
  DrizzleMealLogRepository,
  DrizzleWeightLogRepository,
  DrizzleDailyGoalRepository,
  DrizzleInsightRepository,
  errorHandler,
  registerRoutes,
  registerSwagger,
} from "./infrastructure";
import fastifyRawBody from "fastify-raw-body";

const baseCorsConfig = {
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
};

const fastify = Fastify({
  logger: true,
});

async function bootstrap() {
  try {
    // Google Cloud Run will set PORT environment variable
    // You must listen on all IPV4 addresses (0.0.0.0) in Cloud Run
    // Also check for K_SERVICE which Cloud Run sets
    const IS_GOOGLE_CLOUD_RUN = process.env.K_SERVICE !== undefined || process.env.PORT !== undefined;
    const host = IS_GOOGLE_CLOUD_RUN ? "0.0.0.0" : undefined;

    console.log(`Starting server...`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Port: ${env.PORT}`);
    console.log(`Host: ${host || "default"}`);
    console.log(`Cloud Run: ${IS_GOOGLE_CLOUD_RUN ? "yes" : "no"}`);

    // Swagger documentation (register before routes)
    await registerSwagger(fastify);


  await fastify.register(fastifyRawBody, {
    field: "rawBody",
    global: false, // Don't add raw body to all routes
    encoding: "utf8",
    runFirst: true,
    routes: [], // Will be enabled per-route via config
  });


  // Middleware
  await fastify.register(fastifyCors, baseCorsConfig);
  fastify.setErrorHandler(errorHandler);

  // Dependency Injection - Create repository instances
  const userRepository = new DrizzleUserRepository();
  const userProfileRepository = new DrizzleUserProfileRepository();
  const cycleLogRepository = new DrizzleCycleLogRepository();
  const moodLogRepository = new DrizzleMoodLogRepository();
  const symptomLogRepository = new DrizzleSymptomLogRepository();
  const mealLogRepository = new DrizzleMealLogRepository();
  const weightLogRepository = new DrizzleWeightLogRepository();
  const dailyGoalRepository = new DrizzleDailyGoalRepository();
  const insightRepository = new DrizzleInsightRepository();

  // Register routes with dependencies
  registerRoutes(fastify, {
    userRepository,
    userProfileRepository,
    cycleLogRepository,
    moodLogRepository,
    symptomLogRepository,
    mealLogRepository,
    weightLogRepository,
    dailyGoalRepository,
    insightRepository,
  });

  // Health check
  fastify.get("/health", {
    schema: {
      tags: ["Health"],
      summary: "Health check",
      description: "Check if the server is running",
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
  }, async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

    // Start server
    await fastify.listen({ port: env.PORT, host: host });
    console.log(`✅ Server running on port ${env.PORT}`);
    console.log(`✅ API Documentation available at http://${host || "localhost"}:${env.PORT}/docs`);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    fastify.log.error(err);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

bootstrap();

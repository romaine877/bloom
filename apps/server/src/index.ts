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
  // Swagger documentation (register before routes)
  await registerSwagger(fastify);

    // Google Cloud Run will set this environment variable for you, so
  // you can also use it to detect if you are running in Cloud Run
  const IS_GOOGLE_CLOUD_RUN = process.env.K_SERVICE !== undefined



  // You must listen on all IPV4 addresses in Cloud Run
  const host = IS_GOOGLE_CLOUD_RUN ? "0.0.0.0" : undefined


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
  try {
    await fastify.listen({ port: env.PORT, host: host });
    console.log(`Server running on port ${env.PORT}`);
    console.log(`API Documentation available at http://${env.HOST}:${env.PORT}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();

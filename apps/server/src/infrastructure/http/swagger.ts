import type { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export async function registerSwagger(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Bloom API",
        description: "API for the Bloom PCOS wellness tracking app",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
      tags: [
        { name: "Health", description: "Health check endpoints" },
        { name: "Profile", description: "User profile and onboarding" },
        { name: "Cycle", description: "Menstrual cycle tracking" },
        { name: "Mood", description: "Mood and energy tracking" },
        { name: "Symptoms", description: "Symptom logging" },
        { name: "Meals", description: "Meal diary" },
        { name: "Weight", description: "Weight tracking" },
        { name: "Daily Goals", description: "Water and steps tracking" },
        { name: "Insights", description: "Health tips and articles" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Clerk JWT token",
          },
        },
      },
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      persistAuthorization: true,
    },
    staticCSP: true,
  });
}


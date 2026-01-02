import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { DailyGoalRepository } from "../../../domain";
import { DailyGoalsController } from "../controllers/daily-goals.controller";
import { clerkAuth, type AuthenticatedRequest } from "../middleware/clerk-auth";

const addWaterSchema = z.object({
  glasses: z.number().int().positive().optional(),
});

const updateStepsSchema = z.object({
  steps: z.number().int().min(0),
});

export function registerDailyGoalsRoutes(fastify: FastifyInstance, dailyGoalRepository: DailyGoalRepository) {
  const controller = new DailyGoalsController(dailyGoalRepository);

  fastify.get("/daily-goals", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Daily Goals"],
      summary: "Get today's goals",
      description: "Retrieve daily goals (water and steps) for today",
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            date: { type: "string", format: "date-time" },
            waterGlasses: { type: "integer" },
            waterGoal: { type: "integer" },
            waterProgress: { type: "number", minimum: 0, maximum: 1 },
            steps: { type: "integer" },
            stepsGoal: { type: "integer" },
            stepsProgress: { type: "number", minimum: 0, maximum: 1 },
          },
        },
      },
    },
  }, async (request, reply) => {
    return controller.getToday(request as AuthenticatedRequest, reply);
  });

  fastify.post("/daily-goals/water", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Daily Goals"],
      summary: "Add water intake",
      description: "Add glasses of water to today's goal",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          glasses: { type: "integer", minimum: 1, default: 1 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            waterGlasses: { type: "integer" },
            waterProgress: { type: "number" },
            steps: { type: "integer" },
            stepsProgress: { type: "number" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = addWaterSchema.parse(request.body);
    return controller.addWater({ ...(request as AuthenticatedRequest), body } as any, reply);
  });

  fastify.post("/daily-goals/steps", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Daily Goals"],
      summary: "Update step count",
      description: "Set the current step count for today",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["steps"],
        properties: {
          steps: { type: "integer", minimum: 0 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            waterGlasses: { type: "integer" },
            waterProgress: { type: "number" },
            steps: { type: "integer" },
            stepsProgress: { type: "number" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = updateStepsSchema.parse(request.body);
    return controller.updateSteps({ ...(request as AuthenticatedRequest), body } as any, reply);
  });
}

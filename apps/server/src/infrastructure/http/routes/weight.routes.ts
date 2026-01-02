import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { WeightLogRepository } from "../../../domain";
import { WeightController } from "../controllers/weight.controller";
import { clerkAuth, type AuthenticatedRequest } from "../middleware/clerk-auth";

const logWeightSchema = z.object({
  date: z.string().datetime().optional(),
  weight: z.number().positive(),
  unit: z.enum(["kg", "lbs"]),
  notes: z.string().optional(),
});

const weightHistoryQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export function registerWeightRoutes(fastify: FastifyInstance, weightLogRepository: WeightLogRepository) {
  const controller = new WeightController(weightLogRepository);

  fastify.post("/weight", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Weight"],
      summary: "Log weight",
      description: "Log a weight measurement",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["weight", "unit"],
        properties: {
          date: { type: "string", format: "date-time" },
          weight: { type: "number", exclusiveMinimum: 0 },
          unit: { type: "string", enum: ["kg", "lbs"] },
          notes: { type: "string" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            date: { type: "string", format: "date-time" },
            weight: { type: "number" },
            unit: { type: "string" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = logWeightSchema.parse(request.body);
    return controller.logWeight({ ...(request as AuthenticatedRequest), body } as any, reply);
  });

  fastify.get("/weight", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Weight"],
      summary: "Get weight history",
      description: "Retrieve weight logs within a date range",
      security: [{ bearerAuth: [] }],
      querystring: {
        type: "object",
        required: ["startDate", "endDate"],
        properties: {
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
        },
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              date: { type: "string", format: "date-time" },
              weight: { type: "number" },
              unit: { type: "string" },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const query = weightHistoryQuerySchema.parse(request.query);
    return controller.getHistory({ ...(request as AuthenticatedRequest), query } as any, reply);
  });
}

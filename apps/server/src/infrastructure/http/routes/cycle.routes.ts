import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { CycleLogRepository } from "../../../domain";
import { CycleController } from "../controllers/cycle.controller";
import { clerkAuth, type AuthenticatedRequest } from "../middleware/clerk-auth";

const logCycleSchema = z.object({
  date: z.string().datetime(),
  phase: z.enum(["menstrual", "follicular", "ovulation", "luteal"]),
  dayOfCycle: z.number().int().min(1).max(45),
  flowIntensity: z.enum(["light", "medium", "heavy", "spotting"]).optional(),
  notes: z.string().optional(),
});

const cycleHistoryQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export function registerCycleRoutes(fastify: FastifyInstance, cycleLogRepository: CycleLogRepository) {
  const controller = new CycleController(cycleLogRepository);

  fastify.post("/cycle", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Cycle"],
      summary: "Log cycle data",
      description: "Log menstrual cycle information for a specific date",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["date", "phase", "dayOfCycle"],
        properties: {
          date: { type: "string", format: "date-time" },
          phase: { type: "string", enum: ["menstrual", "follicular", "ovulation", "luteal"] },
          dayOfCycle: { type: "integer", minimum: 1, maximum: 45 },
          flowIntensity: { type: "string", enum: ["light", "medium", "heavy", "spotting"] },
          notes: { type: "string" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            date: { type: "string", format: "date-time" },
            phase: { type: "string" },
            dayOfCycle: { type: "integer" },
            flowIntensity: { type: "string", nullable: true },
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = logCycleSchema.parse(request.body);
    return controller.logCycle({ ...(request as AuthenticatedRequest), body } as any, reply);
  });

  fastify.get("/cycle", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Cycle"],
      summary: "Get cycle history",
      description: "Retrieve cycle logs within a date range",
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
              phase: { type: "string" },
              dayOfCycle: { type: "integer" },
              flowIntensity: { type: "string", nullable: true },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const query = cycleHistoryQuerySchema.parse(request.query);
    return controller.getHistory({ ...(request as AuthenticatedRequest), query } as any, reply);
  });
}

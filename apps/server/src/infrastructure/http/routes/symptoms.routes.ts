import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { SymptomLogRepository } from "../../../domain";
import { SymptomsController } from "../controllers/symptoms.controller";
import { clerkAuth, type AuthenticatedRequest } from "../middleware/clerk-auth";

const symptomTypes = [
  "cramps",
  "headache",
  "bloating",
  "fatigue",
  "acne",
  "breast_tenderness",
  "nausea",
  "back_pain",
  "insomnia",
  "anxiety",
  "irritability",
  "cravings",
  "hot_flashes",
  "hair_loss",
  "other",
] as const;

const logSymptomSchema = z.object({
  date: z.string().datetime().optional(),
  symptomType: z.enum(symptomTypes),
  severity: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
  notes: z.string().optional(),
});

const getSymptomsByDateSchema = z.object({
  date: z.string().datetime(),
});

export function registerSymptomsRoutes(fastify: FastifyInstance, symptomLogRepository: SymptomLogRepository) {
  const controller = new SymptomsController(symptomLogRepository);

  fastify.post("/symptoms", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Symptoms"],
      summary: "Log a symptom",
      description: "Log a symptom with severity level (1-5)",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["symptomType", "severity"],
        properties: {
          date: { type: "string", format: "date-time" },
          symptomType: { type: "string", enum: [...symptomTypes] },
          severity: { type: "integer", minimum: 1, maximum: 5, description: "1 = mild, 5 = severe" },
          notes: { type: "string" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            date: { type: "string", format: "date-time" },
            symptomType: { type: "string" },
            severity: { type: "integer" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = logSymptomSchema.parse(request.body);
    return controller.logSymptom({ ...(request as AuthenticatedRequest), body } as any, reply);
  });

  fastify.get("/symptoms", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Symptoms"],
      summary: "Get symptoms by date",
      description: "Retrieve all symptoms logged for a specific date",
      security: [{ bearerAuth: [] }],
      querystring: {
        type: "object",
        required: ["date"],
        properties: {
          date: { type: "string", format: "date-time" },
        },
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              symptomType: { type: "string" },
              severity: { type: "integer" },
              notes: { type: "string", nullable: true },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const query = getSymptomsByDateSchema.parse(request.query);
    return controller.getByDate({ ...(request as AuthenticatedRequest), query } as any, reply);
  });
}

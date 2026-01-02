import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { MoodLogRepository } from "../../../domain";
import { MoodController } from "../controllers/mood.controller";
import { clerkAuth, type AuthenticatedRequest } from "../middleware/clerk-auth";

const logMoodSchema = z.object({
  date: z.string().datetime().optional(),
  mood: z.enum(["happy", "energetic", "calm", "tired", "anxious", "bloated", "stressed", "sad"]),
  energyLevel: z.number().int().min(1).max(10),
  notes: z.string().optional(),
});

export function registerMoodRoutes(fastify: FastifyInstance, moodLogRepository: MoodLogRepository) {
  const controller = new MoodController(moodLogRepository);

  fastify.post("/mood", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Mood"],
      summary: "Log mood",
      description: "Log daily mood and energy level",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["mood", "energyLevel"],
        properties: {
          date: { type: "string", format: "date-time", description: "Defaults to current time if not provided" },
          mood: {
            type: "string",
            enum: ["happy", "energetic", "calm", "tired", "anxious", "bloated", "stressed", "sad"],
          },
          energyLevel: { type: "integer", minimum: 1, maximum: 10 },
          notes: { type: "string" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            date: { type: "string", format: "date-time" },
            mood: { type: "string" },
            energyLevel: { type: "integer" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = logMoodSchema.parse(request.body);
    return controller.logMood({ ...(request as AuthenticatedRequest), body } as any, reply);
  });
}

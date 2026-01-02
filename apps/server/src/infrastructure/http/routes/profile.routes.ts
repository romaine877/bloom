import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { UserProfileRepository } from "../../../domain";
import { ProfileController } from "../controllers/profile.controller";
import { clerkAuth, type AuthenticatedRequest } from "../middleware/clerk-auth";

const completeOnboardingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  primaryGoal: z.enum(["fertility", "weight", "skin", "mental"]),
  symptoms: z.array(z.enum(["irregular", "fatigue", "acne", "mood", "cravings"])),
});

export function registerProfileRoutes(fastify: FastifyInstance, userProfileRepository: UserProfileRepository) {
  const controller = new ProfileController(userProfileRepository);

  fastify.get("/profile", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Profile"],
      summary: "Get user profile",
      description: "Retrieve the authenticated user's profile information",
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            primaryGoal: { type: "string", enum: ["fertility", "weight", "skin", "mental"] },
            symptoms: { type: "array", items: { type: "string" } },
            onboardingCompleted: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        404: {
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
  }, async (request, reply) => {
    return controller.getProfile(request as AuthenticatedRequest, reply);
  });

  fastify.post("/profile/onboarding", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Profile"],
      summary: "Complete onboarding",
      description: "Complete user onboarding with goals and symptoms",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["name", "email", "primaryGoal", "symptoms"],
        properties: {
          name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          primaryGoal: { type: "string", enum: ["fertility", "weight", "skin", "mental"] },
          symptoms: {
            type: "array",
            items: { type: "string", enum: ["irregular", "fatigue", "acne", "mood", "cravings"] },
          },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string" },
            name: { type: "string" },
            primaryGoal: { type: "string" },
            symptoms: { type: "array", items: { type: "string" } },
            onboardingCompleted: { type: "boolean" },
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = completeOnboardingSchema.parse(request.body);
    return controller.completeOnboarding({ ...(request as AuthenticatedRequest), body } as any, reply);
  });
}

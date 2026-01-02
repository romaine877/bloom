import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { MealLogRepository } from "../../../domain";
import { MealsController } from "../controllers/meals.controller";
import { clerkAuth, type AuthenticatedRequest } from "../middleware/clerk-auth";

const logMealSchema = z.object({
  date: z.string().datetime().optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  description: z.string().min(1),
  calories: z.number().int().positive().optional(),
  photoUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

const getMealsByDateSchema = z.object({
  date: z.string().datetime(),
});

export function registerMealsRoutes(fastify: FastifyInstance, mealLogRepository: MealLogRepository) {
  const controller = new MealsController(mealLogRepository);

  fastify.post("/meals", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Meals"],
      summary: "Log a meal",
      description: "Log a meal with optional calorie count",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["mealType", "description"],
        properties: {
          date: { type: "string", format: "date-time" },
          mealType: { type: "string", enum: ["breakfast", "lunch", "dinner", "snack"] },
          description: { type: "string", minLength: 1 },
          calories: { type: "integer", minimum: 1 },
          photoUrl: { type: "string", format: "uri" },
          notes: { type: "string" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            date: { type: "string", format: "date-time" },
            mealType: { type: "string" },
            description: { type: "string" },
            calories: { type: "integer", nullable: true },
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = logMealSchema.parse(request.body);
    return controller.logMeal({ ...(request as AuthenticatedRequest), body } as any, reply);
  });

  fastify.get("/meals", {
    preHandler: clerkAuth,
    schema: {
      tags: ["Meals"],
      summary: "Get meals by date",
      description: "Retrieve all meals logged for a specific date",
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
              mealType: { type: "string" },
              description: { type: "string" },
              calories: { type: "integer", nullable: true },
              photoUrl: { type: "string", nullable: true },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const query = getMealsByDateSchema.parse(request.query);
    return controller.getByDate({ ...(request as AuthenticatedRequest), query } as any, reply);
  });
}

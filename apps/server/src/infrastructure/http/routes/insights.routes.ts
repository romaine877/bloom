import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { InsightRepository } from "../../../domain";
import { InsightsController } from "../controllers/insights.controller";

const insightCategories = ["nutrition", "lifestyle", "symptoms", "cycle", "mental_health"] as const;

const listInsightsQuerySchema = z.object({
  category: z.enum(insightCategories).optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

export function registerInsightsRoutes(fastify: FastifyInstance, insightRepository: InsightRepository) {
  const controller = new InsightsController(insightRepository);

  fastify.get("/insights/daily", {
    schema: {
      tags: ["Insights"],
      summary: "Get daily insight",
      description: "Get a featured health tip/insight for the day (no auth required)",
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            summary: { type: "string" },
            content: { type: "string" },
            category: { type: "string", enum: [...insightCategories] },
            imageUrl: { type: "string", nullable: true },
            readTimeMinutes: { type: "integer" },
          },
        },
        404: {
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
  }, async (request, reply) => {
    return controller.getDailyInsight(request, reply);
  });

  fastify.get("/insights", {
    schema: {
      tags: ["Insights"],
      summary: "List insights",
      description: "List all health insights with optional category filter",
      querystring: {
        type: "object",
        properties: {
          category: { type: "string", enum: [...insightCategories] },
          limit: { type: "string", pattern: "^[0-9]+$" },
          offset: { type: "string", pattern: "^[0-9]+$" },
        },
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              title: { type: "string" },
              summary: { type: "string" },
              category: { type: "string" },
              imageUrl: { type: "string", nullable: true },
              readTimeMinutes: { type: "integer" },
              publishedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const query = listInsightsQuerySchema.parse(request.query);
    return controller.list({ ...request, query } as any, reply);
  });
}

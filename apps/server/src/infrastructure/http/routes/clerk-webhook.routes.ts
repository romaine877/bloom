// apps/server/src/infrastructure/http/routes/clerk-webhook.routes.ts
import type { FastifyInstance } from "fastify";

import type { UserProfileRepository } from "../../../domain";
import { ClerkWebhookController } from "../controllers/webhooks/clerk-webhook.controller";

export function registerClerkWebhookRoutes(
  fastify: FastifyInstance,
  userProfileRepository: UserProfileRepository
) {
  const controller = new ClerkWebhookController(userProfileRepository);

  fastify.post("/webhooks/clerk", {
    config: {
      rawBody: true, // Important for signature verification
    },
    schema: {
      tags: ["Webhooks"],
      summary: "Clerk webhook handler",
      description: "Handles user lifecycle events from Clerk",
      hide: true, // Hide from public docs
    },
  }, async (request, reply) => {
    return controller.handleWebhook(request, reply);
  });
}
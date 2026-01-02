// apps/server/src/infrastructure/http/controllers/clerk-webhook.controller.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { Webhook } from "svix";
import { env } from "@bloom-app/env/server";

import type { UserProfileRepository } from "../../../../domain";
import { UserProfile } from "../../../../domain";

interface ClerkUserData {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserData;
}

export class ClerkWebhookController {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handleWebhook(request: FastifyRequest, reply: FastifyReply) {
    const svixId = request.headers["svix-id"] as string;
    const svixTimestamp = request.headers["svix-timestamp"] as string;
    const svixSignature = request.headers["svix-signature"] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      return reply.status(400).send({ error: "Missing svix headers" });
    }

    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
    let event: ClerkWebhookEvent;

      // Get the raw body for signature verification
  const rawBody = (request as FastifyRequest & { rawBody?: string }).rawBody;

  if (!rawBody) {
    return reply.status(400).send({ error: "Missing raw body" });
  }

    try {
      // Verify the webhook signature
      event = wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkWebhookEvent;
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return reply.status(400).send({ error: "Invalid webhook signature" });
    }

    // Handle the event
    switch (event.type) {
      case "user.created":
        await this.handleUserCreated(event.data);
        break;
      case "user.updated":
        await this.handleUserUpdated(event.data);
        break;
      case "user.deleted":
        await this.handleUserDeleted(event.data);
        break;
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }

    return reply.status(200).send({ received: true });
  }

  private async handleUserCreated(data: ClerkUserData) {
    const email = data.email_addresses[0]?.email_address;
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "User";

    if (!email) {
      console.error("No email found for user:", data.id);
      return;
    }

    // Check if profile already exists
    const existing = await this.userProfileRepository.findByUserId(data.id);
    if (existing) return;

    // Create a basic profile - onboarding will complete it
    const profile = UserProfile.create({
      userId: data.id,
      name,
      email,
      primaryGoal: "fertility", // default, updated during onboarding
      symptoms: [],
    });

    await this.userProfileRepository.save(profile);
    console.log(`Created profile for user: ${data.id}`);
  }

  private async handleUserUpdated(data: ClerkUserData) {
    const profile = await this.userProfileRepository.findByUserId(data.id);
    if (!profile) return;

    // Update profile if needed (name changes, etc.)
    // You can extend this based on your needs
    console.log(`User updated: ${data.id}`);
  }

  private async handleUserDeleted(data: ClerkUserData) {
    const profile = await this.userProfileRepository.findByUserId(data.id);
    if (profile) {
      await this.userProfileRepository.delete(profile.id);
      console.log(`Deleted profile for user: ${data.id}`);
    }
  }
}
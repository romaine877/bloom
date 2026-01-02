import type { FastifyReply, FastifyRequest } from "fastify";
import { createClerkClient } from "@clerk/backend";
import { env } from "@bloom-app/env/server";

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

export interface AuthenticatedRequest extends FastifyRequest {
  userId: string;
}

export async function clerkAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);

    const { sub: userId } = await clerk.verifyToken(token);

    if (!userId) {
      return reply.status(401).send({ error: "Invalid token" });
    }

    (request as AuthenticatedRequest).userId = userId;
  } catch (error) {
    console.error("Auth error:", error);
    return reply.status(401).send({ error: "Unauthorized" });
  }
}


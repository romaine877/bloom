import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export function errorHandler(error: FastifyError, _request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "Validation Error",
      details: error.errors,
    });
  }

  // Log unexpected errors
  console.error(error);

  return reply.status(500).send({
    error: "Internal Server Error",
  });
}


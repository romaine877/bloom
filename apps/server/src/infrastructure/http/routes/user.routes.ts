import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { UserRepository } from "../../../domain";
import { UserController } from "../controllers/user.controller";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

const userIdParamSchema = z.object({
  id: z.string().uuid(),
});

export function registerUserRoutes(fastify: FastifyInstance, userRepository: UserRepository) {
  const controller = new UserController(userRepository);

  fastify.post("/users", async (request, reply) => {
    const body = createUserSchema.parse(request.body);
    return controller.create({ ...request, body } as any, reply);
  });

  fastify.get("/users", async (request, reply) => {
    return controller.list(request, reply);
  });

  fastify.get("/users/:id", async (request, reply) => {
    const params = userIdParamSchema.parse(request.params);
    return controller.getById({ ...request, params } as any, reply);
  });

  fastify.delete("/users/:id", async (request, reply) => {
    const params = userIdParamSchema.parse(request.params);
    return controller.delete({ ...request, params } as any, reply);
  });
}


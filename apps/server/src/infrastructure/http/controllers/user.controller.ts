import type { FastifyReply, FastifyRequest } from "fastify";

import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
} from "../../../application";
import type { UserRepository } from "../../../domain";

export class UserController {
  private readonly createUserUseCase: CreateUserUseCase;
  private readonly getUserUseCase: GetUserUseCase;
  private readonly listUsersUseCase: ListUsersUseCase;
  private readonly deleteUserUseCase: DeleteUserUseCase;

  constructor(userRepository: UserRepository) {
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.getUserUseCase = new GetUserUseCase(userRepository);
    this.listUsersUseCase = new ListUsersUseCase(userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
  }

  async create(
    request: FastifyRequest<{ Body: { email: string; name: string } }>,
    reply: FastifyReply
  ) {
    try {
      const result = await this.createUserUseCase.execute(request.body);
      return reply.status(201).send(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        return reply.status(409).send({ error: error.message });
      }
      throw error;
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const result = await this.getUserUseCase.execute({ id: request.params.id });

    if (!result) {
      return reply.status(404).send({ error: "User not found" });
    }

    return reply.send(result);
  }

  async list(_request: FastifyRequest, reply: FastifyReply) {
    const result = await this.listUsersUseCase.execute();
    return reply.send(result);
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await this.deleteUserUseCase.execute({ id: request.params.id });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return reply.status(404).send({ error: error.message });
      }
      throw error;
    }
  }
}


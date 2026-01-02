import type { FastifyReply } from "fastify";

import { GetDailyGoalUseCase, UpdateDailyGoalUseCase } from "../../../application";
import type { DailyGoalRepository } from "../../../domain";
import type { AuthenticatedRequest } from "../middleware/clerk-auth";

export class DailyGoalsController {
  private readonly getDailyGoalUseCase: GetDailyGoalUseCase;
  private readonly updateDailyGoalUseCase: UpdateDailyGoalUseCase;

  constructor(dailyGoalRepository: DailyGoalRepository) {
    this.getDailyGoalUseCase = new GetDailyGoalUseCase(dailyGoalRepository);
    this.updateDailyGoalUseCase = new UpdateDailyGoalUseCase(dailyGoalRepository);
  }

  async getToday(request: AuthenticatedRequest, reply: FastifyReply) {
    const result = await this.getDailyGoalUseCase.execute({
      userId: request.userId,
      date: new Date(),
    });

    return reply.send(result);
  }

  async addWater(request: AuthenticatedRequest & { Body: { glasses?: number } }, reply: FastifyReply) {
    const result = await this.updateDailyGoalUseCase.execute({
      userId: request.userId,
      date: new Date(),
      addWater: request.body.glasses ?? 1,
    });

    return reply.send(result);
  }

  async updateSteps(request: AuthenticatedRequest & { Body: { steps: number } }, reply: FastifyReply) {
    const result = await this.updateDailyGoalUseCase.execute({
      userId: request.userId,
      date: new Date(),
      steps: request.body.steps,
    });

    return reply.send(result);
  }
}


import type { FastifyReply } from "fastify";

import { GetWeightHistoryUseCase, LogWeightUseCase } from "../../../application";
import type { WeightLogRepository, WeightUnit } from "../../../domain";
import type { AuthenticatedRequest } from "../middleware/clerk-auth";

export class WeightController {
  private readonly logWeightUseCase: LogWeightUseCase;
  private readonly getWeightHistoryUseCase: GetWeightHistoryUseCase;

  constructor(weightLogRepository: WeightLogRepository) {
    this.logWeightUseCase = new LogWeightUseCase(weightLogRepository);
    this.getWeightHistoryUseCase = new GetWeightHistoryUseCase(weightLogRepository);
  }

  async logWeight(
    request: AuthenticatedRequest & {
      Body: { date?: string; weight: number; unit: WeightUnit; notes?: string };
    },
    reply: FastifyReply
  ) {
    const result = await this.logWeightUseCase.execute({
      userId: request.userId,
      date: request.body.date ? new Date(request.body.date) : new Date(),
      weight: request.body.weight,
      unit: request.body.unit,
      notes: request.body.notes,
    });

    return reply.status(201).send(result);
  }

  async getHistory(
    request: AuthenticatedRequest & { Querystring: { startDate: string; endDate: string } },
    reply: FastifyReply
  ) {
    const result = await this.getWeightHistoryUseCase.execute({
      userId: request.userId,
      startDate: new Date(request.query.startDate),
      endDate: new Date(request.query.endDate),
    });

    return reply.send(result);
  }
}


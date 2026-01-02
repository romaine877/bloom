import type { FastifyReply } from "fastify";

import { GetCycleHistoryUseCase, LogCycleUseCase } from "../../../application";
import type { CycleLogRepository, CyclePhase, FlowIntensity } from "../../../domain";
import type { AuthenticatedRequest } from "../middleware/clerk-auth";

export class CycleController {
  private readonly logCycleUseCase: LogCycleUseCase;
  private readonly getCycleHistoryUseCase: GetCycleHistoryUseCase;

  constructor(cycleLogRepository: CycleLogRepository) {
    this.logCycleUseCase = new LogCycleUseCase(cycleLogRepository);
    this.getCycleHistoryUseCase = new GetCycleHistoryUseCase(cycleLogRepository);
  }

  async logCycle(
    request: AuthenticatedRequest & {
      Body: {
        date: string;
        phase: CyclePhase;
        dayOfCycle: number;
        flowIntensity?: FlowIntensity;
        notes?: string;
      };
    },
    reply: FastifyReply
  ) {
    const result = await this.logCycleUseCase.execute({
      userId: request.userId,
      date: new Date(request.body.date),
      phase: request.body.phase,
      dayOfCycle: request.body.dayOfCycle,
      flowIntensity: request.body.flowIntensity,
      notes: request.body.notes,
    });

    return reply.status(201).send(result);
  }

  async getHistory(
    request: AuthenticatedRequest & { Querystring: { startDate: string; endDate: string } },
    reply: FastifyReply
  ) {
    const result = await this.getCycleHistoryUseCase.execute({
      userId: request.userId,
      startDate: new Date(request.query.startDate),
      endDate: new Date(request.query.endDate),
    });

    return reply.send(result);
  }
}


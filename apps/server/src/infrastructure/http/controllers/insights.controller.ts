import type { FastifyReply, FastifyRequest } from "fastify";

import { GetDailyInsightUseCase, ListInsightsUseCase } from "../../../application";
import type { InsightCategory, InsightRepository } from "../../../domain";

export class InsightsController {
  private readonly getDailyInsightUseCase: GetDailyInsightUseCase;
  private readonly listInsightsUseCase: ListInsightsUseCase;

  constructor(insightRepository: InsightRepository) {
    this.getDailyInsightUseCase = new GetDailyInsightUseCase(insightRepository);
    this.listInsightsUseCase = new ListInsightsUseCase(insightRepository);
  }

  async getDailyInsight(_request: FastifyRequest, reply: FastifyReply) {
    const result = await this.getDailyInsightUseCase.execute();

    if (!result) {
      return reply.status(404).send({ error: "No insights available" });
    }

    return reply.send(result);
  }

  async list(
    request: FastifyRequest<{
      Querystring: { category?: InsightCategory; limit?: string; offset?: string };
    }>,
    reply: FastifyReply
  ) {
    const result = await this.listInsightsUseCase.execute({
      category: request.query.category,
      limit: request.query.limit ? parseInt(request.query.limit) : undefined,
      offset: request.query.offset ? parseInt(request.query.offset) : undefined,
    });

    return reply.send(result);
  }
}


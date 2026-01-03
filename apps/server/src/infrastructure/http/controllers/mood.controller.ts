import type { FastifyReply } from "fastify";

import { LogMoodUseCase } from "../../../application";
import type { MoodLogRepository, MoodType } from "../../../domain";
import type { AuthenticatedRequest } from "../middleware/clerk-auth";

export class MoodController {
  private readonly logMoodUseCase: LogMoodUseCase;

  constructor(moodLogRepository: MoodLogRepository) {
    this.logMoodUseCase = new LogMoodUseCase(moodLogRepository);
  }

  async logMood(
    request: AuthenticatedRequest & {
      body: { date?: string; mood: MoodType; energyLevel: number; notes?: string };
    },
    reply: FastifyReply
  ) {
    const result = await this.logMoodUseCase.execute({
      userId: request.userId,
      date: request.body.date ? new Date(request.body.date) : new Date(),
      mood: request.body.mood,
      energyLevel: request.body.energyLevel,
      notes: request.body.notes,
    });

    return reply.status(201).send(result);
  }
}


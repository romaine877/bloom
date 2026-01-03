import type { FastifyReply } from "fastify";

import { GetMealsByDateUseCase, LogMealUseCase } from "../../../application";
import type { MealLogRepository, MealType } from "../../../domain";
import type { AuthenticatedRequest } from "../middleware/clerk-auth";

export class MealsController {
  private readonly logMealUseCase: LogMealUseCase;
  private readonly getMealsByDateUseCase: GetMealsByDateUseCase;

  constructor(mealLogRepository: MealLogRepository) {
    this.logMealUseCase = new LogMealUseCase(mealLogRepository);
    this.getMealsByDateUseCase = new GetMealsByDateUseCase(mealLogRepository);
  }

  async logMeal(
    request: AuthenticatedRequest & {
      body: {
        date?: string;
        mealType: MealType;
        description: string;
        calories?: number;
        photoUrl?: string;
        notes?: string;
      };
    },
    reply: FastifyReply
  ) {
    const result = await this.logMealUseCase.execute({
      userId: request.userId,
      date: request.body.date ? new Date(request.body.date) : new Date(),
      mealType: request.body.mealType,
      description: request.body.description,
      calories: request.body.calories,
      photoUrl: request.body.photoUrl,
      notes: request.body.notes,
    });

    return reply.status(201).send(result);
  }

  async getByDate(
    request: AuthenticatedRequest & { query: { date: string } },
    reply: FastifyReply
  ) {
    const result = await this.getMealsByDateUseCase.execute({
      userId: request.userId,
      date: new Date(request.query.date),
    });

    return reply.send(result);
  }
}


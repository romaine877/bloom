import { MealLog, type MealLogRepository, type MealType } from "../../../domain";

export interface LogMealInput {
  userId: string;
  date: Date;
  mealType: MealType;
  description: string;
  calories?: number | null;
  photoUrl?: string | null;
  notes?: string | null;
}

export interface LogMealOutput {
  id: string;
  date: Date;
  mealType: MealType;
  description: string;
  calories: number | null;
}

export class LogMealUseCase {
  constructor(private readonly mealLogRepository: MealLogRepository) {}

  async execute(input: LogMealInput): Promise<LogMealOutput> {
    const log = MealLog.create({
      userId: input.userId,
      date: input.date,
      mealType: input.mealType,
      description: input.description,
      calories: input.calories ?? null,
      photoUrl: input.photoUrl ?? null,
      notes: input.notes ?? null,
    });

    await this.mealLogRepository.save(log);

    return {
      id: log.id,
      date: log.date,
      mealType: log.mealType,
      description: log.description,
      calories: log.calories,
    };
  }
}


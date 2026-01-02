import type { MealLogRepository, MealType } from "../../../domain";

export interface GetMealsByDateInput {
  userId: string;
  date: Date;
}

export interface MealEntry {
  id: string;
  mealType: MealType;
  description: string;
  calories: number | null;
  photoUrl: string | null;
}

export class GetMealsByDateUseCase {
  constructor(private readonly mealLogRepository: MealLogRepository) {}

  async execute(input: GetMealsByDateInput): Promise<MealEntry[]> {
    const logs = await this.mealLogRepository.findByUserIdAndDate(input.userId, input.date);

    return logs.map((log) => ({
      id: log.id,
      mealType: log.mealType,
      description: log.description,
      calories: log.calories,
      photoUrl: log.photoUrl,
    }));
  }
}


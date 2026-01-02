import type { MealLog } from "../entities/meal-log.entity";

export interface MealLogRepository {
  findById(id: string): Promise<MealLog | null>;
  findByUserIdAndDate(userId: string, date: Date): Promise<MealLog[]>;
  findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<MealLog[]>;
  save(log: MealLog): Promise<void>;
  delete(id: string): Promise<void>;
}


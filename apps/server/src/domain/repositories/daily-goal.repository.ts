import type { DailyGoal } from "../entities/daily-goal.entity";

export interface DailyGoalRepository {
  findById(id: string): Promise<DailyGoal | null>;
  findByUserIdAndDate(userId: string, date: Date): Promise<DailyGoal | null>;
  findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<DailyGoal[]>;
  save(goal: DailyGoal): Promise<void>;
}


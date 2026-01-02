import type { WeightLog } from "../entities/weight-log.entity";

export interface WeightLogRepository {
  findById(id: string): Promise<WeightLog | null>;
  findByUserIdAndDate(userId: string, date: Date): Promise<WeightLog | null>;
  findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<WeightLog[]>;
  findLatestByUserId(userId: string): Promise<WeightLog | null>;
  save(log: WeightLog): Promise<void>;
  delete(id: string): Promise<void>;
}


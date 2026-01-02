import type { MoodLog } from "../entities/mood-log.entity";

export interface MoodLogRepository {
  findById(id: string): Promise<MoodLog | null>;
  findByUserIdAndDate(userId: string, date: Date): Promise<MoodLog | null>;
  findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<MoodLog[]>;
  save(log: MoodLog): Promise<void>;
  delete(id: string): Promise<void>;
}


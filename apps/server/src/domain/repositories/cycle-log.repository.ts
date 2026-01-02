import type { CycleLog } from "../entities/cycle-log.entity";

export interface CycleLogRepository {
  findById(id: string): Promise<CycleLog | null>;
  findByUserIdAndDate(userId: string, date: Date): Promise<CycleLog | null>;
  findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<CycleLog[]>;
  findLatestByUserId(userId: string, limit?: number): Promise<CycleLog[]>;
  save(log: CycleLog): Promise<void>;
  delete(id: string): Promise<void>;
}


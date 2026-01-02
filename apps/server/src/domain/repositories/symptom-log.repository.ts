import type { SymptomLog } from "../entities/symptom-log.entity";

export interface SymptomLogRepository {
  findById(id: string): Promise<SymptomLog | null>;
  findByUserIdAndDate(userId: string, date: Date): Promise<SymptomLog[]>;
  findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<SymptomLog[]>;
  save(log: SymptomLog): Promise<void>;
  delete(id: string): Promise<void>;
}


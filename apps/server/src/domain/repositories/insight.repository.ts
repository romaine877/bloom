import type { Insight, InsightCategory } from "../entities/insight.entity";

export interface InsightRepository {
  findById(id: string): Promise<Insight | null>;
  findAll(limit?: number, offset?: number): Promise<Insight[]>;
  findByCategory(category: InsightCategory, limit?: number): Promise<Insight[]>;
  findDailyInsight(): Promise<Insight | null>;
  save(insight: Insight): Promise<void>;
}


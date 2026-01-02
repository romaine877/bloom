import type { InsightCategory, InsightRepository } from "../../../domain";

export interface DailyInsightOutput {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: InsightCategory;
  imageUrl: string | null;
  readTimeMinutes: number;
}

export class GetDailyInsightUseCase {
  constructor(private readonly insightRepository: InsightRepository) {}

  async execute(): Promise<DailyInsightOutput | null> {
    const insight = await this.insightRepository.findDailyInsight();

    if (!insight) {
      return null;
    }

    return {
      id: insight.id,
      title: insight.title,
      summary: insight.summary,
      content: insight.content,
      category: insight.category,
      imageUrl: insight.imageUrl,
      readTimeMinutes: insight.readTimeMinutes,
    };
  }
}


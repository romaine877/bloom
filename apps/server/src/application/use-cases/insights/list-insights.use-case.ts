import type { InsightCategory, InsightRepository } from "../../../domain";

export interface ListInsightsInput {
  category?: InsightCategory;
  limit?: number;
  offset?: number;
}

export interface InsightSummary {
  id: string;
  title: string;
  summary: string;
  category: InsightCategory;
  imageUrl: string | null;
  readTimeMinutes: number;
  publishedAt: Date;
}

export class ListInsightsUseCase {
  constructor(private readonly insightRepository: InsightRepository) {}

  async execute(input: ListInsightsInput): Promise<InsightSummary[]> {
    const insights = input.category
      ? await this.insightRepository.findByCategory(input.category, input.limit)
      : await this.insightRepository.findAll(input.limit, input.offset);

    return insights.map((insight) => ({
      id: insight.id,
      title: insight.title,
      summary: insight.summary,
      category: insight.category,
      imageUrl: insight.imageUrl,
      readTimeMinutes: insight.readTimeMinutes,
      publishedAt: insight.publishedAt,
    }));
  }
}


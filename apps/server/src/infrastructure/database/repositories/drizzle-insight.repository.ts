import { db, eq, desc, sqlOperator } from "@bloom-app/db";
import { insights } from "@bloom-app/db/schema";

import { Insight, type InsightCategory, type InsightRepository } from "../../../domain";

export class DrizzleInsightRepository implements InsightRepository {
  async findById(id: string): Promise<Insight | null> {
    const [record] = await db.select().from(insights).where(eq(insights.id, id)).limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findAll(limit = 20, offset = 0): Promise<Insight[]> {
    const records = await db
      .select()
      .from(insights)
      .orderBy(desc(insights.publishedAt))
      .limit(limit)
      .offset(offset);

    return records.map((r) => this.toDomain(r));
  }

  async findByCategory(category: InsightCategory, limit = 10): Promise<Insight[]> {
    const records = await db
      .select()
      .from(insights)
      .where(eq(insights.category, category))
      .orderBy(desc(insights.publishedAt))
      .limit(limit);

    return records.map((r) => this.toDomain(r));
  }

  async findDailyInsight(): Promise<Insight | null> {
    // Get a "random" insight based on the current day
    // This ensures users see the same insight throughout the day
    const [record] = await db
      .select()
      .from(insights)
      .orderBy(sqlOperator`RANDOM()`)
      .limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async save(insight: Insight): Promise<void> {
    const data = insight.toJSON();

    await db
      .insert(insights)
      .values({
        id: data.id,
        title: data.title,
        summary: data.summary,
        content: data.content,
        category: data.category,
        imageUrl: data.imageUrl,
        readTimeMinutes: data.readTimeMinutes,
        publishedAt: data.publishedAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .onConflictDoUpdate({
        target: insights.id,
        set: {
          title: data.title,
          summary: data.summary,
          content: data.content,
          updatedAt: data.updatedAt,
        },
      });
  }

  private toDomain(record: typeof insights.$inferSelect): Insight {
    return Insight.reconstitute({
      id: record.id,
      title: record.title,
      summary: record.summary,
      content: record.content,
      category: record.category as InsightCategory,
      imageUrl: record.imageUrl,
      readTimeMinutes: record.readTimeMinutes,
      publishedAt: record.publishedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}


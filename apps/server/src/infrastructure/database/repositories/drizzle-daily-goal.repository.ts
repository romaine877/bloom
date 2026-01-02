import { db, and, eq, desc, gte, lte } from "@bloom-app/db";
import { dailyGoals } from "@bloom-app/db/schema";

import { DailyGoal, type DailyGoalRepository } from "../../../domain";

export class DrizzleDailyGoalRepository implements DailyGoalRepository {
  async findById(id: string): Promise<DailyGoal | null> {
    const [record] = await db.select().from(dailyGoals).where(eq(dailyGoals.id, id)).limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<DailyGoal | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [record] = await db
      .select()
      .from(dailyGoals)
      .where(
        and(
          eq(dailyGoals.userId, userId),
          gte(dailyGoals.date, startOfDay),
          lte(dailyGoals.date, endOfDay)
        )
      )
      .limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<DailyGoal[]> {
    const records = await db
      .select()
      .from(dailyGoals)
      .where(
        and(
          eq(dailyGoals.userId, userId),
          gte(dailyGoals.date, startDate),
          lte(dailyGoals.date, endDate)
        )
      )
      .orderBy(desc(dailyGoals.date));

    return records.map((r) => this.toDomain(r));
  }

  async save(goal: DailyGoal): Promise<void> {
    const data = goal.toJSON();

    await db
      .insert(dailyGoals)
      .values({
        id: data.id,
        userId: data.userId,
        date: data.date,
        waterGlasses: data.waterGlasses,
        waterGoal: data.waterGoal,
        steps: data.steps,
        stepsGoal: data.stepsGoal,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .onConflictDoUpdate({
        target: dailyGoals.id,
        set: {
          waterGlasses: data.waterGlasses,
          steps: data.steps,
          updatedAt: data.updatedAt,
        },
      });
  }

  private toDomain(record: typeof dailyGoals.$inferSelect): DailyGoal {
    return DailyGoal.reconstitute({
      id: record.id,
      userId: record.userId,
      date: record.date,
      waterGlasses: record.waterGlasses,
      waterGoal: record.waterGoal,
      steps: record.steps,
      stepsGoal: record.stepsGoal,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}


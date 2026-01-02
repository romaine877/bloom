import { db, and, eq, desc, gte, lte } from "@bloom-app/db";
import { mealLogs } from "@bloom-app/db/schema";

import { MealLog, type MealLogRepository, type MealType } from "../../../domain";

export class DrizzleMealLogRepository implements MealLogRepository {
  async findById(id: string): Promise<MealLog | null> {
    const [record] = await db.select().from(mealLogs).where(eq(mealLogs.id, id)).limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<MealLog[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const records = await db
      .select()
      .from(mealLogs)
      .where(
        and(
          eq(mealLogs.userId, userId),
          gte(mealLogs.date, startOfDay),
          lte(mealLogs.date, endOfDay)
        )
      );

    return records.map((r) => this.toDomain(r));
  }

  async findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<MealLog[]> {
    const records = await db
      .select()
      .from(mealLogs)
      .where(
        and(eq(mealLogs.userId, userId), gte(mealLogs.date, startDate), lte(mealLogs.date, endDate))
      )
      .orderBy(desc(mealLogs.date));

    return records.map((r) => this.toDomain(r));
  }

  async save(log: MealLog): Promise<void> {
    const data = log.toJSON();

    await db.insert(mealLogs).values({
      id: data.id,
      userId: data.userId,
      date: data.date,
      mealType: data.mealType,
      description: data.description,
      calories: data.calories,
      photoUrl: data.photoUrl,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await db.delete(mealLogs).where(eq(mealLogs.id, id));
  }

  private toDomain(record: typeof mealLogs.$inferSelect): MealLog {
    return MealLog.reconstitute({
      id: record.id,
      userId: record.userId,
      date: record.date,
      mealType: record.mealType as MealType,
      description: record.description,
      calories: record.calories,
      photoUrl: record.photoUrl,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}


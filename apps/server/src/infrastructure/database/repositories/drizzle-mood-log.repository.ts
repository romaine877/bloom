import { db, and, eq, desc, gte, lte } from "@bloom-app/db";
import { moodLogs } from "@bloom-app/db/schema";

import { MoodLog, type MoodLogRepository, type MoodType } from "../../../domain";

export class DrizzleMoodLogRepository implements MoodLogRepository {
  async findById(id: string): Promise<MoodLog | null> {
    const [record] = await db.select().from(moodLogs).where(eq(moodLogs.id, id)).limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<MoodLog | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [record] = await db
      .select()
      .from(moodLogs)
      .where(
        and(eq(moodLogs.userId, userId), gte(moodLogs.date, startOfDay), lte(moodLogs.date, endOfDay))
      )
      .limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<MoodLog[]> {
    const records = await db
      .select()
      .from(moodLogs)
      .where(
        and(eq(moodLogs.userId, userId), gte(moodLogs.date, startDate), lte(moodLogs.date, endDate))
      )
      .orderBy(desc(moodLogs.date));

    return records.map((r) => this.toDomain(r));
  }

  async save(log: MoodLog): Promise<void> {
    const data = log.toJSON();

    await db
      .insert(moodLogs)
      .values({
        id: data.id,
        userId: data.userId,
        date: data.date,
        mood: data.mood,
        energyLevel: data.energyLevel,
        notes: data.notes,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .onConflictDoUpdate({
        target: moodLogs.id,
        set: {
          mood: data.mood,
          energyLevel: data.energyLevel,
          notes: data.notes,
          updatedAt: data.updatedAt,
        },
      });
  }

  async delete(id: string): Promise<void> {
    await db.delete(moodLogs).where(eq(moodLogs.id, id));
  }

  private toDomain(record: typeof moodLogs.$inferSelect): MoodLog {
    return MoodLog.reconstitute({
      id: record.id,
      userId: record.userId,
      date: record.date,
      mood: record.mood as MoodType,
      energyLevel: record.energyLevel,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}


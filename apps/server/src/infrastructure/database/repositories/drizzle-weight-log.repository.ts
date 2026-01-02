import { db, and, eq, desc, gte, lte } from "@bloom-app/db";
import { weightLogs } from "@bloom-app/db/schema";

import { WeightLog, type WeightLogRepository, type WeightUnit } from "../../../domain";

export class DrizzleWeightLogRepository implements WeightLogRepository {
  async findById(id: string): Promise<WeightLog | null> {
    const [record] = await db.select().from(weightLogs).where(eq(weightLogs.id, id)).limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<WeightLog | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [record] = await db
      .select()
      .from(weightLogs)
      .where(
        and(
          eq(weightLogs.userId, userId),
          gte(weightLogs.date, startOfDay),
          lte(weightLogs.date, endOfDay)
        )
      )
      .limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<WeightLog[]> {
    const records = await db
      .select()
      .from(weightLogs)
      .where(
        and(
          eq(weightLogs.userId, userId),
          gte(weightLogs.date, startDate),
          lte(weightLogs.date, endDate)
        )
      )
      .orderBy(desc(weightLogs.date));

    return records.map((r) => this.toDomain(r));
  }

  async findLatestByUserId(userId: string): Promise<WeightLog | null> {
    const [record] = await db
      .select()
      .from(weightLogs)
      .where(eq(weightLogs.userId, userId))
      .orderBy(desc(weightLogs.date))
      .limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async save(log: WeightLog): Promise<void> {
    const data = log.toJSON();

    await db.insert(weightLogs).values({
      id: data.id,
      userId: data.userId,
      date: data.date,
      weight: data.weight.toString(),
      unit: data.unit,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await db.delete(weightLogs).where(eq(weightLogs.id, id));
  }

  private toDomain(record: typeof weightLogs.$inferSelect): WeightLog {
    return WeightLog.reconstitute({
      id: record.id,
      userId: record.userId,
      date: record.date,
      weight: parseFloat(record.weight),
      unit: record.unit as WeightUnit,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}


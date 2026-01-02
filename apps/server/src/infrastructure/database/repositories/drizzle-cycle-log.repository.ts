import { db, and, eq, desc, gte, lte } from "@bloom-app/db";
import { cycleLogs } from "@bloom-app/db/schema";

import {
  CycleLog,
  type CycleLogRepository,
  type CyclePhase,
  type FlowIntensity,
} from "../../../domain";

export class DrizzleCycleLogRepository implements CycleLogRepository {
  async findById(id: string): Promise<CycleLog | null> {
    const [record] = await db.select().from(cycleLogs).where(eq(cycleLogs.id, id)).limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<CycleLog | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [record] = await db
      .select()
      .from(cycleLogs)
      .where(
        and(
          eq(cycleLogs.userId, userId),
          gte(cycleLogs.date, startOfDay),
          lte(cycleLogs.date, endOfDay)
        )
      )
      .limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdInRange(userId: string, startDate: Date, endDate: Date): Promise<CycleLog[]> {
    const records = await db
      .select()
      .from(cycleLogs)
      .where(
        and(
          eq(cycleLogs.userId, userId),
          gte(cycleLogs.date, startDate),
          lte(cycleLogs.date, endDate)
        )
      )
      .orderBy(desc(cycleLogs.date));

    return records.map((r) => this.toDomain(r));
  }

  async findLatestByUserId(userId: string, limit = 30): Promise<CycleLog[]> {
    const records = await db
      .select()
      .from(cycleLogs)
      .where(eq(cycleLogs.userId, userId))
      .orderBy(desc(cycleLogs.date))
      .limit(limit);

    return records.map((r) => this.toDomain(r));
  }

  async save(log: CycleLog): Promise<void> {
    const data = log.toJSON();

    await db
      .insert(cycleLogs)
      .values({
        id: data.id,
        userId: data.userId,
        date: data.date,
        phase: data.phase,
        dayOfCycle: data.dayOfCycle,
        flowIntensity: data.flowIntensity,
        notes: data.notes,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .onConflictDoUpdate({
        target: cycleLogs.id,
        set: {
          phase: data.phase,
          flowIntensity: data.flowIntensity,
          notes: data.notes,
          updatedAt: data.updatedAt,
        },
      });
  }

  async delete(id: string): Promise<void> {
    await db.delete(cycleLogs).where(eq(cycleLogs.id, id));
  }

  private toDomain(record: typeof cycleLogs.$inferSelect): CycleLog {
    return CycleLog.reconstitute({
      id: record.id,
      userId: record.userId,
      date: record.date,
      phase: record.phase as CyclePhase,
      dayOfCycle: record.dayOfCycle,
      flowIntensity: record.flowIntensity as FlowIntensity | null,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}


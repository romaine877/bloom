import { db, and, eq, desc, gte, lte } from "@bloom-app/db";
import { symptomLogs } from "@bloom-app/db/schema";

import {
  SymptomLog,
  type SymptomLogRepository,
  type SymptomSeverity,
  type SymptomType,
} from "../../../domain";

export class DrizzleSymptomLogRepository implements SymptomLogRepository {
  async findById(id: string): Promise<SymptomLog | null> {
    const [record] = await db.select().from(symptomLogs).where(eq(symptomLogs.id, id)).limit(1);

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<SymptomLog[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const records = await db
      .select()
      .from(symptomLogs)
      .where(
        and(
          eq(symptomLogs.userId, userId),
          gte(symptomLogs.date, startOfDay),
          lte(symptomLogs.date, endOfDay)
        )
      );

    return records.map((r) => this.toDomain(r));
  }

  async findByUserIdInRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<SymptomLog[]> {
    const records = await db
      .select()
      .from(symptomLogs)
      .where(
        and(
          eq(symptomLogs.userId, userId),
          gte(symptomLogs.date, startDate),
          lte(symptomLogs.date, endDate)
        )
      )
      .orderBy(desc(symptomLogs.date));

    return records.map((r) => this.toDomain(r));
  }

  async save(log: SymptomLog): Promise<void> {
    const data = log.toJSON();

    await db.insert(symptomLogs).values({
      id: data.id,
      userId: data.userId,
      date: data.date,
      symptomType: data.symptomType,
      severity: data.severity,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await db.delete(symptomLogs).where(eq(symptomLogs.id, id));
  }

  private toDomain(record: typeof symptomLogs.$inferSelect): SymptomLog {
    return SymptomLog.reconstitute({
      id: record.id,
      userId: record.userId,
      date: record.date,
      symptomType: record.symptomType as SymptomType,
      severity: record.severity as SymptomSeverity,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}


import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const symptomLogs = pgTable("symptom_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  symptomType: text("symptom_type", {
    enum: [
      "cramps",
      "headache",
      "bloating",
      "fatigue",
      "acne",
      "breast_tenderness",
      "nausea",
      "back_pain",
      "insomnia",
      "anxiety",
      "irritability",
      "cravings",
      "hot_flashes",
      "hair_loss",
      "other",
    ],
  }).notNull(),
  severity: integer("severity").notNull(), // 1-5
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SymptomLogRecord = typeof symptomLogs.$inferSelect;
export type NewSymptomLogRecord = typeof symptomLogs.$inferInsert;


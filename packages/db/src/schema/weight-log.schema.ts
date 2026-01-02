import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const weightLogs = pgTable("weight_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  weight: numeric("weight", { precision: 5, scale: 2 }).notNull(),
  unit: text("unit", { enum: ["kg", "lbs"] }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WeightLogRecord = typeof weightLogs.$inferSelect;
export type NewWeightLogRecord = typeof weightLogs.$inferInsert;


import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const cycleLogs = pgTable("cycle_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  phase: text("phase", { enum: ["menstrual", "follicular", "ovulation", "luteal"] }).notNull(),
  dayOfCycle: integer("day_of_cycle").notNull(),
  flowIntensity: text("flow_intensity", { enum: ["light", "medium", "heavy", "spotting"] }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CycleLogRecord = typeof cycleLogs.$inferSelect;
export type NewCycleLogRecord = typeof cycleLogs.$inferInsert;


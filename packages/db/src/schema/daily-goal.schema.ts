import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const dailyGoals = pgTable("daily_goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  waterGlasses: integer("water_glasses").notNull().default(0),
  waterGoal: integer("water_goal").notNull().default(8),
  steps: integer("steps").notNull().default(0),
  stepsGoal: integer("steps_goal").notNull().default(10000),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DailyGoalRecord = typeof dailyGoals.$inferSelect;
export type NewDailyGoalRecord = typeof dailyGoals.$inferInsert;


import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const moodLogs = pgTable("mood_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  mood: text("mood", {
    enum: ["happy", "energetic", "calm", "tired", "anxious", "bloated", "stressed", "sad"],
  }).notNull(),
  energyLevel: integer("energy_level").notNull(), // 1-10
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MoodLogRecord = typeof moodLogs.$inferSelect;
export type NewMoodLogRecord = typeof moodLogs.$inferInsert;


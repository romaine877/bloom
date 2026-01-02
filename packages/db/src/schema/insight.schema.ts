import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const insights = pgTable("insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category", {
    enum: ["nutrition", "lifestyle", "symptoms", "cycle", "mental_health"],
  }).notNull(),
  imageUrl: text("image_url"),
  readTimeMinutes: integer("read_time_minutes").notNull().default(3),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type InsightRecord = typeof insights.$inferSelect;
export type NewInsightRecord = typeof insights.$inferInsert;


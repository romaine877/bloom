import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const mealLogs = pgTable("meal_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  mealType: text("meal_type", { enum: ["breakfast", "lunch", "dinner", "snack"] }).notNull(),
  description: text("description").notNull(),
  calories: integer("calories"),
  photoUrl: text("photo_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MealLogRecord = typeof mealLogs.$inferSelect;
export type NewMealLogRecord = typeof mealLogs.$inferInsert;


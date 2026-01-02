import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(), // Clerk user ID
  name: text("name").notNull(),
  email: text("email").notNull(),
  primaryGoal: text("primary_goal", { enum: ["fertility", "weight", "skin", "mental"] }).notNull(),
  symptoms: text("symptoms").array().notNull().default([]),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserProfileRecord = typeof userProfiles.$inferSelect;
export type NewUserProfileRecord = typeof userProfiles.$inferInsert;


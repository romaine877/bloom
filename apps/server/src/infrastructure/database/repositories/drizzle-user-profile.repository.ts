import { db, eq } from "@bloom-app/db";
import { userProfiles } from "@bloom-app/db/schema";

import { type Goal, type Symptom, UserProfile, type UserProfileRepository } from "../../../domain";

export class DrizzleUserProfileRepository implements UserProfileRepository {
  async findById(id: string): Promise<UserProfile | null> {
    const [record] = await db.select().from(userProfiles).where(eq(userProfiles.id, id)).limit(1);

    if (!record) return null;

    return UserProfile.reconstitute({
      id: record.id,
      userId: record.userId,
      name: record.name,
      email: record.email,
      primaryGoal: record.primaryGoal as Goal,
      symptoms: record.symptoms as Symptom[],
      onboardingCompleted: record.onboardingCompleted,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<UserProfile | null> {
    const [record] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (!record) return null;

    return UserProfile.reconstitute({
      id: record.id,
      userId: record.userId,
      name: record.name,
      email: record.email,
      primaryGoal: record.primaryGoal as Goal,
      symptoms: record.symptoms as Symptom[],
      onboardingCompleted: record.onboardingCompleted,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async save(profile: UserProfile): Promise<void> {
    const data = profile.toJSON();

    await db
      .insert(userProfiles)
      .values({
        id: data.id,
        userId: data.userId,
        name: data.name,
        email: data.email,
        primaryGoal: data.primaryGoal,
        symptoms: data.symptoms,
        onboardingCompleted: data.onboardingCompleted,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .onConflictDoUpdate({
        target: userProfiles.id,
        set: {
          name: data.name,
          primaryGoal: data.primaryGoal,
          symptoms: data.symptoms,
          onboardingCompleted: data.onboardingCompleted,
          updatedAt: data.updatedAt,
        },
      });
  }

  async delete(id: string): Promise<void> {
    await db.delete(userProfiles).where(eq(userProfiles.id, id));
  }
}


import type { UserProfile } from "../entities/user-profile.entity";

export interface UserProfileRepository {
  findById(id: string): Promise<UserProfile | null>;
  findByUserId(userId: string): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<void>;
  delete(id: string): Promise<void>;
}


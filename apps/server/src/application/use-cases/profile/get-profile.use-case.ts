import type { Goal, Symptom, UserProfileRepository } from "../../../domain";

export interface GetProfileInput {
  userId: string;
}

export interface GetProfileOutput {
  id: string;
  userId: string;
  name: string;
  email: string;
  primaryGoal: Goal;
  symptoms: Symptom[];
  onboardingCompleted: boolean;
  createdAt: Date;
}

export class GetProfileUseCase {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async execute(input: GetProfileInput): Promise<GetProfileOutput | null> {
    const profile = await this.userProfileRepository.findByUserId(input.userId);

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      userId: profile.userId,
      name: profile.name,
      email: profile.email,
      primaryGoal: profile.primaryGoal,
      symptoms: profile.symptoms,
      onboardingCompleted: profile.onboardingCompleted,
      createdAt: profile.createdAt,
    };
  }
}


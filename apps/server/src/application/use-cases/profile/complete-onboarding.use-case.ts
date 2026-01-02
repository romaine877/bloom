import { type Goal, type Symptom, UserProfile, type UserProfileRepository } from "../../../domain";

export interface CompleteOnboardingInput {
  userId: string;
  name: string;
  email: string;
  primaryGoal: Goal;
  symptoms: Symptom[];
}

export interface CompleteOnboardingOutput {
  id: string;
  userId: string;
  name: string;
  primaryGoal: Goal;
  symptoms: Symptom[];
  onboardingCompleted: boolean;
}

export class CompleteOnboardingUseCase {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async execute(input: CompleteOnboardingInput): Promise<CompleteOnboardingOutput> {
    let profile = await this.userProfileRepository.findByUserId(input.userId);

    if (profile) {
      profile.updateGoal(input.primaryGoal);
      profile.updateSymptoms(input.symptoms);
      profile.completeOnboarding();
    } else {
      profile = UserProfile.create({
        userId: input.userId,
        name: input.name,
        email: input.email,
        primaryGoal: input.primaryGoal,
        symptoms: input.symptoms,
      });
      profile.completeOnboarding();
    }

    await this.userProfileRepository.save(profile);

    return {
      id: profile.id,
      userId: profile.userId,
      name: profile.name,
      primaryGoal: profile.primaryGoal,
      symptoms: profile.symptoms,
      onboardingCompleted: profile.onboardingCompleted,
    };
  }
}


export type Goal = "fertility" | "weight" | "skin" | "mental";
export type Symptom = "irregular" | "fatigue" | "acne" | "mood" | "cravings";

export interface UserProfileProps {
  id: string;
  userId: string; // Clerk user ID
  name: string;
  email: string;
  primaryGoal: Goal;
  symptoms: Symptom[];
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfile {
  private constructor(private readonly props: UserProfileProps) {}

  static create(props: Omit<UserProfileProps, "id" | "createdAt" | "updatedAt" | "onboardingCompleted">): UserProfile {
    return new UserProfile({
      ...props,
      id: crypto.randomUUID(),
      onboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: UserProfileProps): UserProfile {
    return new UserProfile(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get primaryGoal(): Goal {
    return this.props.primaryGoal;
  }

  get symptoms(): Symptom[] {
    return [...this.props.symptoms];
  }

  get onboardingCompleted(): boolean {
    return this.props.onboardingCompleted;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  completeOnboarding(): void {
    this.props.onboardingCompleted = true;
    this.props.updatedAt = new Date();
  }

  updateGoal(goal: Goal): void {
    this.props.primaryGoal = goal;
    this.props.updatedAt = new Date();
  }

  updateSymptoms(symptoms: Symptom[]): void {
    this.props.symptoms = symptoms;
    this.props.updatedAt = new Date();
  }

  toJSON(): UserProfileProps {
    return { ...this.props, symptoms: [...this.props.symptoms] };
  }
}


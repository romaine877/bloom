export type MoodType = "happy" | "energetic" | "calm" | "tired" | "anxious" | "bloated" | "stressed" | "sad";

export interface MoodLogProps {
  id: string;
  userId: string;
  date: Date;
  mood: MoodType;
  energyLevel: number; // 1-10
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class MoodLog {
  private constructor(private readonly props: MoodLogProps) {}

  static create(props: Omit<MoodLogProps, "id" | "createdAt" | "updatedAt">): MoodLog {
    if (props.energyLevel < 1 || props.energyLevel > 10) {
      throw new Error("Energy level must be between 1 and 10");
    }

    return new MoodLog({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: MoodLogProps): MoodLog {
    return new MoodLog(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get date(): Date {
    return this.props.date;
  }

  get mood(): MoodType {
    return this.props.mood;
  }

  get energyLevel(): number {
    return this.props.energyLevel;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): MoodLogProps {
    return { ...this.props };
  }
}


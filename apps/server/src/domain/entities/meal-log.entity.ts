export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealLogProps {
  id: string;
  userId: string;
  date: Date;
  mealType: MealType;
  description: string;
  calories: number | null;
  photoUrl: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class MealLog {
  private constructor(private readonly props: MealLogProps) {}

  static create(props: Omit<MealLogProps, "id" | "createdAt" | "updatedAt">): MealLog {
    return new MealLog({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: MealLogProps): MealLog {
    return new MealLog(props);
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

  get mealType(): MealType {
    return this.props.mealType;
  }

  get description(): string {
    return this.props.description;
  }

  get calories(): number | null {
    return this.props.calories;
  }

  get photoUrl(): string | null {
    return this.props.photoUrl;
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

  toJSON(): MealLogProps {
    return { ...this.props };
  }
}


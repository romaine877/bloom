export type WeightUnit = "kg" | "lbs";

export interface WeightLogProps {
  id: string;
  userId: string;
  date: Date;
  weight: number;
  unit: WeightUnit;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class WeightLog {
  private constructor(private readonly props: WeightLogProps) {}

  static create(props: Omit<WeightLogProps, "id" | "createdAt" | "updatedAt">): WeightLog {
    if (props.weight <= 0) {
      throw new Error("Weight must be a positive number");
    }

    return new WeightLog({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: WeightLogProps): WeightLog {
    return new WeightLog(props);
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

  get weight(): number {
    return this.props.weight;
  }

  get unit(): WeightUnit {
    return this.props.unit;
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

  getWeightInKg(): number {
    return this.props.unit === "kg" ? this.props.weight : this.props.weight * 0.453592;
  }

  toJSON(): WeightLogProps {
    return { ...this.props };
  }
}


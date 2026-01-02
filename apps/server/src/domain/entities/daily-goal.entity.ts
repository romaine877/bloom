export interface DailyGoalProps {
  id: string;
  userId: string;
  date: Date;
  waterGlasses: number;
  waterGoal: number;
  steps: number;
  stepsGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

export class DailyGoal {
  private constructor(private readonly props: DailyGoalProps) {}

  static create(props: Omit<DailyGoalProps, "id" | "createdAt" | "updatedAt">): DailyGoal {
    return new DailyGoal({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: DailyGoalProps): DailyGoal {
    return new DailyGoal(props);
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

  get waterGlasses(): number {
    return this.props.waterGlasses;
  }

  get waterGoal(): number {
    return this.props.waterGoal;
  }

  get steps(): number {
    return this.props.steps;
  }

  get stepsGoal(): number {
    return this.props.stepsGoal;
  }

  get waterProgress(): number {
    return Math.min(this.props.waterGlasses / this.props.waterGoal, 1);
  }

  get stepsProgress(): number {
    return Math.min(this.props.steps / this.props.stepsGoal, 1);
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  addWater(glasses: number = 1): void {
    this.props.waterGlasses += glasses;
    this.props.updatedAt = new Date();
  }

  updateSteps(steps: number): void {
    this.props.steps = steps;
    this.props.updatedAt = new Date();
  }

  toJSON(): DailyGoalProps & { waterProgress: number; stepsProgress: number } {
    return {
      ...this.props,
      waterProgress: this.waterProgress,
      stepsProgress: this.stepsProgress,
    };
  }
}


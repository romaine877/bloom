export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";
export type FlowIntensity = "light" | "medium" | "heavy" | "spotting";

export interface CycleLogProps {
  id: string;
  userId: string;
  date: Date;
  phase: CyclePhase;
  dayOfCycle: number;
  flowIntensity: FlowIntensity | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CycleLog {
  private constructor(private readonly props: CycleLogProps) {}

  static create(
    props: Omit<CycleLogProps, "id" | "createdAt" | "updatedAt">
  ): CycleLog {
    return new CycleLog({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: CycleLogProps): CycleLog {
    return new CycleLog(props);
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

  get phase(): CyclePhase {
    return this.props.phase;
  }

  get dayOfCycle(): number {
    return this.props.dayOfCycle;
  }

  get flowIntensity(): FlowIntensity | null {
    return this.props.flowIntensity;
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

  updateLog(updates: Partial<Pick<CycleLogProps, "phase" | "flowIntensity" | "notes">>): void {
    if (updates.phase) this.props.phase = updates.phase;
    if (updates.flowIntensity !== undefined) this.props.flowIntensity = updates.flowIntensity;
    if (updates.notes !== undefined) this.props.notes = updates.notes;
    this.props.updatedAt = new Date();
  }

  toJSON(): CycleLogProps {
    return { ...this.props };
  }
}


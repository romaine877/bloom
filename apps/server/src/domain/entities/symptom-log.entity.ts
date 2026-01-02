export type SymptomType =
  | "cramps"
  | "headache"
  | "bloating"
  | "fatigue"
  | "acne"
  | "breast_tenderness"
  | "nausea"
  | "back_pain"
  | "insomnia"
  | "anxiety"
  | "irritability"
  | "cravings"
  | "hot_flashes"
  | "hair_loss"
  | "other";

export type SymptomSeverity = 1 | 2 | 3 | 4 | 5;

export interface SymptomLogProps {
  id: string;
  userId: string;
  date: Date;
  symptomType: SymptomType;
  severity: SymptomSeverity;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SymptomLog {
  private constructor(private readonly props: SymptomLogProps) {}

  static create(props: Omit<SymptomLogProps, "id" | "createdAt" | "updatedAt">): SymptomLog {
    return new SymptomLog({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: SymptomLogProps): SymptomLog {
    return new SymptomLog(props);
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

  get symptomType(): SymptomType {
    return this.props.symptomType;
  }

  get severity(): SymptomSeverity {
    return this.props.severity;
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

  updateSeverity(severity: SymptomSeverity): void {
    this.props.severity = severity;
    this.props.updatedAt = new Date();
  }

  toJSON(): SymptomLogProps {
    return { ...this.props };
  }
}


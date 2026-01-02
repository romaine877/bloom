export type InsightCategory = "nutrition" | "lifestyle" | "symptoms" | "cycle" | "mental_health";

export interface InsightProps {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: InsightCategory;
  imageUrl: string | null;
  readTimeMinutes: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Insight {
  private constructor(private readonly props: InsightProps) {}

  static create(props: Omit<InsightProps, "id" | "createdAt" | "updatedAt">): Insight {
    return new Insight({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: InsightProps): Insight {
    return new Insight(props);
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get summary(): string {
    return this.props.summary;
  }

  get content(): string {
    return this.props.content;
  }

  get category(): InsightCategory {
    return this.props.category;
  }

  get imageUrl(): string | null {
    return this.props.imageUrl;
  }

  get readTimeMinutes(): number {
    return this.props.readTimeMinutes;
  }

  get publishedAt(): Date {
    return this.props.publishedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): InsightProps {
    return { ...this.props };
  }
}


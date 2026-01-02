import { WeightLog, type WeightLogRepository, type WeightUnit } from "../../../domain";

export interface LogWeightInput {
  userId: string;
  date: Date;
  weight: number;
  unit: WeightUnit;
  notes?: string | null;
}

export interface LogWeightOutput {
  id: string;
  date: Date;
  weight: number;
  unit: WeightUnit;
}

export class LogWeightUseCase {
  constructor(private readonly weightLogRepository: WeightLogRepository) {}

  async execute(input: LogWeightInput): Promise<LogWeightOutput> {
    const existing = await this.weightLogRepository.findByUserIdAndDate(input.userId, input.date);

    if (existing) {
      await this.weightLogRepository.delete(existing.id);
    }

    const log = WeightLog.create({
      userId: input.userId,
      date: input.date,
      weight: input.weight,
      unit: input.unit,
      notes: input.notes ?? null,
    });

    await this.weightLogRepository.save(log);

    return {
      id: log.id,
      date: log.date,
      weight: log.weight,
      unit: log.unit,
    };
  }
}


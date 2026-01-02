import type { WeightLogRepository, WeightUnit } from "../../../domain";

export interface GetWeightHistoryInput {
  userId: string;
  startDate: Date;
  endDate: Date;
}

export interface WeightHistoryEntry {
  id: string;
  date: Date;
  weight: number;
  unit: WeightUnit;
}

export class GetWeightHistoryUseCase {
  constructor(private readonly weightLogRepository: WeightLogRepository) {}

  async execute(input: GetWeightHistoryInput): Promise<WeightHistoryEntry[]> {
    const logs = await this.weightLogRepository.findByUserIdInRange(
      input.userId,
      input.startDate,
      input.endDate
    );

    return logs.map((log) => ({
      id: log.id,
      date: log.date,
      weight: log.weight,
      unit: log.unit,
    }));
  }
}


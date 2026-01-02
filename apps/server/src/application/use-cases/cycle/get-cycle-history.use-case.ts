import type { CycleLogRepository, CyclePhase, FlowIntensity } from "../../../domain";

export interface GetCycleHistoryInput {
  userId: string;
  startDate: Date;
  endDate: Date;
}

export interface CycleHistoryEntry {
  id: string;
  date: Date;
  phase: CyclePhase;
  dayOfCycle: number;
  flowIntensity: FlowIntensity | null;
}

export class GetCycleHistoryUseCase {
  constructor(private readonly cycleLogRepository: CycleLogRepository) {}

  async execute(input: GetCycleHistoryInput): Promise<CycleHistoryEntry[]> {
    const logs = await this.cycleLogRepository.findByUserIdInRange(
      input.userId,
      input.startDate,
      input.endDate
    );

    return logs.map((log) => ({
      id: log.id,
      date: log.date,
      phase: log.phase,
      dayOfCycle: log.dayOfCycle,
      flowIntensity: log.flowIntensity,
    }));
  }
}


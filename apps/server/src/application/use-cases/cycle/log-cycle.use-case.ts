import {
  CycleLog,
  type CycleLogRepository,
  type CyclePhase,
  type FlowIntensity,
} from "../../../domain";

export interface LogCycleInput {
  userId: string;
  date: Date;
  phase: CyclePhase;
  dayOfCycle: number;
  flowIntensity?: FlowIntensity | null;
  notes?: string | null;
}

export interface LogCycleOutput {
  id: string;
  date: Date;
  phase: CyclePhase;
  dayOfCycle: number;
  flowIntensity: FlowIntensity | null;
}

export class LogCycleUseCase {
  constructor(private readonly cycleLogRepository: CycleLogRepository) {}

  async execute(input: LogCycleInput): Promise<LogCycleOutput> {
    // Check if a log already exists for this date
    const existing = await this.cycleLogRepository.findByUserIdAndDate(input.userId, input.date);

    let log: CycleLog;

    if (existing) {
      existing.updateLog({
        phase: input.phase,
        flowIntensity: input.flowIntensity,
        notes: input.notes,
      });
      log = existing;
    } else {
      log = CycleLog.create({
        userId: input.userId,
        date: input.date,
        phase: input.phase,
        dayOfCycle: input.dayOfCycle,
        flowIntensity: input.flowIntensity ?? null,
        notes: input.notes ?? null,
      });
    }

    await this.cycleLogRepository.save(log);

    return {
      id: log.id,
      date: log.date,
      phase: log.phase,
      dayOfCycle: log.dayOfCycle,
      flowIntensity: log.flowIntensity,
    };
  }
}


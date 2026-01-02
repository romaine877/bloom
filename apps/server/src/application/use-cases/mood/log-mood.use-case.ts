import { MoodLog, type MoodLogRepository, type MoodType } from "../../../domain";

export interface LogMoodInput {
  userId: string;
  date: Date;
  mood: MoodType;
  energyLevel: number;
  notes?: string | null;
}

export interface LogMoodOutput {
  id: string;
  date: Date;
  mood: MoodType;
  energyLevel: number;
}

export class LogMoodUseCase {
  constructor(private readonly moodLogRepository: MoodLogRepository) {}

  async execute(input: LogMoodInput): Promise<LogMoodOutput> {
    const existing = await this.moodLogRepository.findByUserIdAndDate(input.userId, input.date);

    let log: MoodLog;

    if (existing) {
      // Update existing log for the day
      await this.moodLogRepository.delete(existing.id);
    }

    log = MoodLog.create({
      userId: input.userId,
      date: input.date,
      mood: input.mood,
      energyLevel: input.energyLevel,
      notes: input.notes ?? null,
    });

    await this.moodLogRepository.save(log);

    return {
      id: log.id,
      date: log.date,
      mood: log.mood,
      energyLevel: log.energyLevel,
    };
  }
}


import {
  SymptomLog,
  type SymptomLogRepository,
  type SymptomSeverity,
  type SymptomType,
} from "../../../domain";

export interface LogSymptomInput {
  userId: string;
  date: Date;
  symptomType: SymptomType;
  severity: SymptomSeverity;
  notes?: string | null;
}

export interface LogSymptomOutput {
  id: string;
  date: Date;
  symptomType: SymptomType;
  severity: SymptomSeverity;
}

export class LogSymptomUseCase {
  constructor(private readonly symptomLogRepository: SymptomLogRepository) {}

  async execute(input: LogSymptomInput): Promise<LogSymptomOutput> {
    const log = SymptomLog.create({
      userId: input.userId,
      date: input.date,
      symptomType: input.symptomType,
      severity: input.severity,
      notes: input.notes ?? null,
    });

    await this.symptomLogRepository.save(log);

    return {
      id: log.id,
      date: log.date,
      symptomType: log.symptomType,
      severity: log.severity,
    };
  }
}


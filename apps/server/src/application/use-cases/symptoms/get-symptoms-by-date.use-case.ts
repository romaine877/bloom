import type { SymptomLogRepository, SymptomSeverity, SymptomType } from "../../../domain";

export interface GetSymptomsByDateInput {
  userId: string;
  date: Date;
}

export interface SymptomEntry {
  id: string;
  symptomType: SymptomType;
  severity: SymptomSeverity;
  notes: string | null;
}

export class GetSymptomsByDateUseCase {
  constructor(private readonly symptomLogRepository: SymptomLogRepository) {}

  async execute(input: GetSymptomsByDateInput): Promise<SymptomEntry[]> {
    const logs = await this.symptomLogRepository.findByUserIdAndDate(input.userId, input.date);

    return logs.map((log) => ({
      id: log.id,
      symptomType: log.symptomType,
      severity: log.severity,
      notes: log.notes,
    }));
  }
}


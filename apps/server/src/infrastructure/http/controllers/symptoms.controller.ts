import type { FastifyReply } from "fastify";

import { GetSymptomsByDateUseCase, LogSymptomUseCase } from "../../../application";
import type { SymptomLogRepository, SymptomSeverity, SymptomType } from "../../../domain";
import type { AuthenticatedRequest } from "../middleware/clerk-auth";

export class SymptomsController {
  private readonly logSymptomUseCase: LogSymptomUseCase;
  private readonly getSymptomsByDateUseCase: GetSymptomsByDateUseCase;

  constructor(symptomLogRepository: SymptomLogRepository) {
    this.logSymptomUseCase = new LogSymptomUseCase(symptomLogRepository);
    this.getSymptomsByDateUseCase = new GetSymptomsByDateUseCase(symptomLogRepository);
  }

  async logSymptom(
    request: AuthenticatedRequest & {
      Body: {
        date?: string;
        symptomType: SymptomType;
        severity: SymptomSeverity;
        notes?: string;
      };
    },
    reply: FastifyReply
  ) {
    const result = await this.logSymptomUseCase.execute({
      userId: request.userId,
      date: request.body.date ? new Date(request.body.date) : new Date(),
      symptomType: request.body.symptomType,
      severity: request.body.severity,
      notes: request.body.notes,
    });

    return reply.status(201).send(result);
  }

  async getByDate(
    request: AuthenticatedRequest & { Querystring: { date: string } },
    reply: FastifyReply
  ) {
    const result = await this.getSymptomsByDateUseCase.execute({
      userId: request.userId,
      date: new Date(request.query.date),
    });

    return reply.send(result);
  }
}


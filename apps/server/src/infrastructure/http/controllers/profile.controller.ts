import type { FastifyReply } from "fastify";

import {
  CompleteOnboardingUseCase,
  GetProfileUseCase,
  type CompleteOnboardingInput,
} from "../../../application";
import type { UserProfileRepository } from "../../../domain";
import type { AuthenticatedRequest } from "../middleware/clerk-auth";

export class ProfileController {
  private readonly completeOnboardingUseCase: CompleteOnboardingUseCase;
  private readonly getProfileUseCase: GetProfileUseCase;

  constructor(userProfileRepository: UserProfileRepository) {
    this.completeOnboardingUseCase = new CompleteOnboardingUseCase(userProfileRepository);
    this.getProfileUseCase = new GetProfileUseCase(userProfileRepository);
  }

  async getProfile(request: AuthenticatedRequest, reply: FastifyReply) {
    const result = await this.getProfileUseCase.execute({ userId: request.userId });

    if (!result) {
      return reply.status(404).send({ error: "Profile not found" });
    }

    return reply.send(result);
  }

  async completeOnboarding(
    request: AuthenticatedRequest & { Body: Omit<CompleteOnboardingInput, "userId"> },
    reply: FastifyReply
  ) {
    const result = await this.completeOnboardingUseCase.execute({
      ...(request.body as Omit<CompleteOnboardingInput, "userId">),
      userId: request.userId,
    });

    return reply.status(201).send(result);
  }
}


import type { FastifyInstance } from "fastify";

import type {
  CycleLogRepository,
  DailyGoalRepository,
  InsightRepository,
  MealLogRepository,
  MoodLogRepository,
  SymptomLogRepository,
  UserProfileRepository,
  UserRepository,
  WeightLogRepository,
} from "../../../domain";

import { registerUserRoutes } from "./user.routes";
import { registerProfileRoutes } from "./profile.routes";
import { registerCycleRoutes } from "./cycle.routes";
import { registerMoodRoutes } from "./mood.routes";
import { registerSymptomsRoutes } from "./symptoms.routes";
import { registerMealsRoutes } from "./meals.routes";
import { registerWeightRoutes } from "./weight.routes";
import { registerDailyGoalsRoutes } from "./daily-goals.routes";
import { registerInsightsRoutes } from "./insights.routes";
import { registerClerkWebhookRoutes } from "./clerk-webhook.routes";

export interface RouteRegistrationDeps {
  userRepository: UserRepository;
  userProfileRepository: UserProfileRepository;
  cycleLogRepository: CycleLogRepository;
  moodLogRepository: MoodLogRepository;
  symptomLogRepository: SymptomLogRepository;
  mealLogRepository: MealLogRepository;
  weightLogRepository: WeightLogRepository;
  dailyGoalRepository: DailyGoalRepository;
  insightRepository: InsightRepository;
}

export function registerRoutes(fastify: FastifyInstance, deps: RouteRegistrationDeps) {
  // Legacy user routes
  registerUserRoutes(fastify, deps.userRepository);

  // Bloom app routes
  registerProfileRoutes(fastify, deps.userProfileRepository);
  registerCycleRoutes(fastify, deps.cycleLogRepository);
  registerMoodRoutes(fastify, deps.moodLogRepository);
  registerSymptomsRoutes(fastify, deps.symptomLogRepository);
  registerMealsRoutes(fastify, deps.mealLogRepository);
  registerWeightRoutes(fastify, deps.weightLogRepository);
  registerDailyGoalsRoutes(fastify, deps.dailyGoalRepository);
  registerInsightsRoutes(fastify, deps.insightRepository);

  registerClerkWebhookRoutes(fastify, deps.userProfileRepository);
}

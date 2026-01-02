// User Use Cases (legacy)
export {
  CreateUserUseCase,
  type CreateUserInput,
  type CreateUserOutput,
  GetUserUseCase,
  type GetUserInput,
  type GetUserOutput,
  ListUsersUseCase,
  type ListUsersOutput,
  DeleteUserUseCase,
  type DeleteUserInput,
} from "./use-cases/user";

// Profile Use Cases
export {
  CompleteOnboardingUseCase,
  type CompleteOnboardingInput,
  type CompleteOnboardingOutput,
  GetProfileUseCase,
  type GetProfileInput,
  type GetProfileOutput,
} from "./use-cases/profile";

// Cycle Use Cases
export {
  LogCycleUseCase,
  type LogCycleInput,
  type LogCycleOutput,
  GetCycleHistoryUseCase,
  type GetCycleHistoryInput,
  type CycleHistoryEntry,
} from "./use-cases/cycle";

// Mood Use Cases
export { LogMoodUseCase, type LogMoodInput, type LogMoodOutput } from "./use-cases/mood";

// Symptom Use Cases
export {
  LogSymptomUseCase,
  type LogSymptomInput,
  type LogSymptomOutput,
  GetSymptomsByDateUseCase,
  type GetSymptomsByDateInput,
  type SymptomEntry,
} from "./use-cases/symptoms";

// Meal Use Cases
export {
  LogMealUseCase,
  type LogMealInput,
  type LogMealOutput,
  GetMealsByDateUseCase,
  type GetMealsByDateInput,
  type MealEntry,
} from "./use-cases/meals";

// Weight Use Cases
export {
  LogWeightUseCase,
  type LogWeightInput,
  type LogWeightOutput,
  GetWeightHistoryUseCase,
  type GetWeightHistoryInput,
  type WeightHistoryEntry,
} from "./use-cases/weight";

// Daily Goal Use Cases
export {
  GetDailyGoalUseCase,
  type GetDailyGoalInput,
  type GetDailyGoalOutput,
  UpdateDailyGoalUseCase,
  type UpdateDailyGoalInput,
  type UpdateDailyGoalOutput,
} from "./use-cases/daily-goals";

// Insight Use Cases
export {
  GetDailyInsightUseCase,
  type DailyInsightOutput,
  ListInsightsUseCase,
  type ListInsightsInput,
  type InsightSummary,
} from "./use-cases/insights";

import { DailyGoal, type DailyGoalRepository } from "../../../domain";

export interface GetDailyGoalInput {
  userId: string;
  date: Date;
}

export interface GetDailyGoalOutput {
  id: string;
  date: Date;
  waterGlasses: number;
  waterGoal: number;
  waterProgress: number;
  steps: number;
  stepsGoal: number;
  stepsProgress: number;
}

export class GetDailyGoalUseCase {
  constructor(private readonly dailyGoalRepository: DailyGoalRepository) {}

  async execute(input: GetDailyGoalInput): Promise<GetDailyGoalOutput> {
    let goal = await this.dailyGoalRepository.findByUserIdAndDate(input.userId, input.date);

    if (!goal) {
      // Create default goal for the day
      goal = DailyGoal.create({
        userId: input.userId,
        date: input.date,
        waterGlasses: 0,
        waterGoal: 8,
        steps: 0,
        stepsGoal: 10000,
      });
      await this.dailyGoalRepository.save(goal);
    }

    return {
      id: goal.id,
      date: goal.date,
      waterGlasses: goal.waterGlasses,
      waterGoal: goal.waterGoal,
      waterProgress: goal.waterProgress,
      steps: goal.steps,
      stepsGoal: goal.stepsGoal,
      stepsProgress: goal.stepsProgress,
    };
  }
}


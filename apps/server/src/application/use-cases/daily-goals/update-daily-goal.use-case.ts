import { DailyGoal, type DailyGoalRepository } from "../../../domain";

export interface UpdateDailyGoalInput {
  userId: string;
  date: Date;
  addWater?: number;
  steps?: number;
}

export interface UpdateDailyGoalOutput {
  id: string;
  waterGlasses: number;
  waterProgress: number;
  steps: number;
  stepsProgress: number;
}

export class UpdateDailyGoalUseCase {
  constructor(private readonly dailyGoalRepository: DailyGoalRepository) {}

  async execute(input: UpdateDailyGoalInput): Promise<UpdateDailyGoalOutput> {
    let goal = await this.dailyGoalRepository.findByUserIdAndDate(input.userId, input.date);

    if (!goal) {
      goal = DailyGoal.create({
        userId: input.userId,
        date: input.date,
        waterGlasses: 0,
        waterGoal: 8,
        steps: 0,
        stepsGoal: 10000,
      });
    }

    if (input.addWater) {
      goal.addWater(input.addWater);
    }

    if (input.steps !== undefined) {
      goal.updateSteps(input.steps);
    }

    await this.dailyGoalRepository.save(goal);

    return {
      id: goal.id,
      waterGlasses: goal.waterGlasses,
      waterProgress: goal.waterProgress,
      steps: goal.steps,
      stepsProgress: goal.stepsProgress,
    };
  }
}


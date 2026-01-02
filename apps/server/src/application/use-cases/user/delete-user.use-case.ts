import type { UserRepository } from "../../../domain";

export interface DeleteUserInput {
  id: string;
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(input.id);
  }
}


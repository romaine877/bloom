import type { UserRepository } from "../../../domain";

export interface ListUsersOutput {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<ListUsersOutput[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }));
  }
}


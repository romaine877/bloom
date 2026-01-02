import { db, eq } from "@bloom-app/db";
import { users } from "@bloom-app/db/schema";

import { User, type UserRepository } from "../../../domain";

export class DrizzleUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const [record] = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (!record) {
      return null;
    }

    return User.reconstitute({
      id: record.id,
      email: record.email,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const [record] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!record) {
      return null;
    }

    return User.reconstitute({
      id: record.id,
      email: record.email,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findAll(): Promise<User[]> {
    const result = await db.select().from(users);

    return result.map((record) =>
      User.reconstitute({
        id: record.id,
        email: record.email,
        name: record.name,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      })
    );
  }

  async save(user: User): Promise<void> {
    const data = user.toJSON();

    await db
      .insert(users)
      .values({
        id: data.id,
        email: data.email,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: data.email,
          name: data.name,
          updatedAt: data.updatedAt,
        },
      });
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}


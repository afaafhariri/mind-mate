import type { User, UserCreate } from "../types/auth";

class UserStore {
  private users: Map<string, User & { password: string }> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> userId
  
  constructor() {
    this.createUser({
      email: "test@example.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWRYIW.7KoqWBfu", // password: "password123"
      name: "Test User",
    });
  }

  async createUser(userData: UserCreate & { password: string }): Promise<User> {
    const userId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const now = new Date();
    const user: User & { password: string } = {
      id: userId,
      email: userData.email.toLowerCase(),
      name: userData.name.trim(),
      password: userData.password,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(userId, user);
    this.emailIndex.set(user.email, userId);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findUserByEmail(
    email: string
  ): Promise<(User & { password: string }) | null> {
    const userId = this.emailIndex.get(email.toLowerCase());
    if (!userId) {
      return null;
    }
    return this.users.get(userId) || null;
  }

  async findUserById(userId: string): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async emailExists(email: string): Promise<boolean> {
    return this.emailIndex.has(email.toLowerCase());
  }

  async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(userId, updatedUser);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }
    this.users.delete(userId);
    this.emailIndex.delete(user.email);
    return true;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).map((user) => {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
  }
}

export const userStore = new UserStore();
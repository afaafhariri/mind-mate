import { db } from "../db";
import { User, createUserDTO } from "../models/user";

const userCollection = db.collection("users");

export const createUser = async (user: createUserDTO): Promise<void> => {
  const now = new Date();
  try {
    const userDoc = await userCollection.doc(user.email).get();
    if (userDoc.exists) {
      throw new Error("User with this email already exists");
    }
    await userCollection.doc(user.email).set(
      {
        ...user,
        createdAt: user.createdAt || now,
        updatedAt: now,
      },
      { merge: true }
    );
  } catch (error) {
    console.error(`Error creating user with email ${user.email}:`, error);
    throw new Error("Failed to create user");
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const doc = await userCollection.doc(email).get();
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    if (!data) return null;
    return {
      id: doc.id,
      ...data,
    } as User;
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    throw new Error("Failed to fetch user by email");
  }
};

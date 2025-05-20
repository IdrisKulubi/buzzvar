"use server";

import db from "@/db/drizzle";
import { users, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CreateUserInput } from "../constant";



export async function createUser(userData: CreateUserInput) {
  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userData.id),
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image ?? null,
        emailVerified: new Date(),
        phoneNumber: userData.phoneNumber,
      })
      .returning();

    // Create associated profile
    await db.insert(profiles).values({
      userId: newUser.id,
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

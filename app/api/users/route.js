import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/app/lib/db';
import * as z from "zod";

const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(100), // Added validation for username
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters"), // Fixed error message
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate body against schema
    const { username, email, password } = userSchema.parse(body);

    // Check if user with email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json({
        user: null,
        message: "User with this email already exists",
      });
    }

    // Check if user with username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json({
        user: null,
        message: "User with this username already exists",
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Remove the password field from the response before sending
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({
      user: rest,
      message: "User created successfully!",
    });

  } catch (error) {
    console.error(error); // Log the error for better tracking
    return NextResponse.json({
      message: "Something went wrong!",
    });
  }
}

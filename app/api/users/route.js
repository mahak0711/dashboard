import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/app/lib/db';
import * as z from "zod";

// ✅ User Schema Validation
const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = userSchema.parse(body);

    // ✅ Check if the user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          user: null,
          message: existingUser.email === email
            ? "User with this email already exists"
            : "User with this username already exists",
        },
        { status: 400 }
      );
    }

    // ✅ Assign "ADMIN" role only if the email is mahak@admin.com, otherwise "CLIENT"
    const assignedRole = email === "mahak@admin.com" ? "ADMIN" : "CLIENT";

    // ✅ Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user with the assigned role
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: assignedRole, // Assign "ADMIN" only to mahak@admin.com
      },
    });

    // ✅ Automatically create a welcome ticket for new users
    const welcomeTicket = await db.ticket.create({
      data: {
        description: `Welcome ${newUser.username}! This is your first ticket.`,
        priority: "LOW",
        createdById: newUser.id,
      },
    });

    const { password: _, ...rest } = newUser; // Exclude password from response

    return NextResponse.json(
      {
        user: rest,
        ticket: welcomeTicket,
        message: `User registered successfully! Assigned role: ${assignedRole}. A welcome ticket has been created.`,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error.message);
    return NextResponse.json(
      { message: "Something went wrong!", error: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signIn } from 'next-auth/react'; // Import signIn from next-auth

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, phone, oauthProvider, oauthId } = body;

    if (!email || (!password && !oauthProvider) || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password (or oauthProvider), or phone' },
        { status: 400 }
      );
    }

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // For traditional signup (with email and password)
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create user, handle OAuth and traditional signups
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Optional, only for traditional signups
        phone,
        role: 'Client', // Default role
        oauthProvider,  // Optional, only for OAuth users
        oauthId,        // Optional, only for OAuth users
      },
    });

    // Automatically sign in the user after successful signup
    const response = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (response?.error) {
      return NextResponse.json({ error: response.error }, { status: 500 });
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

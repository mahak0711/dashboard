import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { tickets: true }, // Include tickets in the response
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Create a new user
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Request Body:', body); // Debugging log

    const { phone, password, role, email } = body;

    // Basic validation
    if (!phone || !password || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: phone, password, or email' },
        { status: 400 }
      );
    }

    // Check if user with the same phone or email already exists
    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone },
    });
    if (existingUserByPhone) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 409 }
      );
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        phone,
        email,
        password: hashedPassword,
        role: role || 'Client', // Default to 'Client' if role is not provided
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this phone number or email already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Update a user
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, role } = body;

    // Basic validation
    if (!id || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: id or role' },
        { status: 400 }
      );
    }

    // Update the user
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Delete a user
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    // Basic validation
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
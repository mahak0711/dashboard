import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// Fetch all tickets
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany();
    return NextResponse.json(tickets);
  } catch (error) {
    console.log('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets', details: error.message },
      { status: 500 }
    );
  }
}

// Create a new ticket
export async function POST(request) {
  try {
    const body = await request.text(); 
    console.log('Request body:', body);

    const { title, description, priority, userId } = JSON.parse(body);

    if (!title || !description || !priority || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }


    const ticket = await prisma.ticket.create({
      data: { title, description, priority, userId, status: 'active' },
    });
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create ticket', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
// Update a ticket
export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();

    // Check if the ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Update the ticket
    const ticket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    return NextResponse.json(ticket);
  } catch (error) {
    console.log('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket', details: error.message },
      { status: 500 }
    );
  }
}

// Delete a ticket
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    // Check if the ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Delete the ticket
    await prisma.ticket.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Ticket deleted' });
  } catch (error) {
    console.log('Error deleting ticket:', error);
    return NextResponse.json(
      { error: 'Failed to delete ticket', details: error.message },
      { status: 500 }
    );
  }
}
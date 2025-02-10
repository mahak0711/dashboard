import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  console.log("Session Data in GET:", session); // Debugging

  if (!session || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const tickets = await db.ticket.findMany({
    where: { status: "open" },
    include: { createdBy: true },
  });

  return new Response(JSON.stringify(tickets), { status: 200 });
}


export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log("Session Data in POST:", session); // Debugging

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { description, priority } = await req.json();

    if (!description || !priority) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const newTicket = await db.ticket.create({
      data: {
        description,
        priority,
        createdById: session.user.id, // This was causing the error
      },
    });

    return new Response(JSON.stringify(newTicket), { status: 201 });
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON data" }), { status: 500 });
  }
}

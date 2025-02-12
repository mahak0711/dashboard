import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/app/lib/db";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const tickets = await db.ticket.findMany({
      where: { createdById: session.user.id }, // Fetch only the user's tickets
      orderBy: { createdAt: "desc" }, // Newest first
    });

    return new Response(JSON.stringify(tickets), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}


export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log("Session Data in POST:", session); 

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized");
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
        createdById: session.user.id, 
      },
    });

    return new Response(JSON.stringify(newTicket));
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON data" }), { status: 500 });
  }
}

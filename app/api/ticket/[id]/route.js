import { db } from "@/app/lib/db"; 
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  "use server";

  const { params } = context;
  if (!params?.id) {
    return NextResponse.json({ message: "Params not found" }, { status: 400 });
  }

  const { id } = params;
  console.log("Updating ticket with ID:", id); 

  try {
    const body = await req.json();
    if (!body.status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    console.log("New Status:", body.status); 

    const updatedTicket = await db.Ticket.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updatedTicket, { status: 200 });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { message: "Error updating ticket", error: error.message },
      { status: 500 }
    );
  }
}

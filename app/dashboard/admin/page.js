"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);

  // Redirect non-admin users
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/dashboard/client"); // Redirect non-admins
    }
  }, [session, status]);

  // Fetch open tickets
  useEffect(() => {
    async function fetchTickets() {
      const response = await fetch("/api/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    }
    if (session?.user?.role === "ADMIN") {
      fetchTickets();
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session || session.user.role !== "ADMIN") {
    return null; // Avoid flickering before redirect
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Open Tickets</h2>
      {tickets.length > 0 ? (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <strong>{ticket.description}</strong> - {ticket.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No open tickets</p>
      )}
    </div>
  );
}

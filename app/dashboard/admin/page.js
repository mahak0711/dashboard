"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);

  // Predefined admin email
  const ADMIN_EMAIL = "admin@example.com";

  // Redirect if not the admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.email !== ADMIN_EMAIL) {
      router.push("/dashboard/client"); // Redirect non-admin users
    }
  }, [session, status]);

  // Fetch open tickets
  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch("/api/ticket");
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        }
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      }
    }

    if (session?.user?.email === ADMIN_EMAIL) {
      fetchTickets();
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session || session.user.email !== ADMIN_EMAIL) {
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

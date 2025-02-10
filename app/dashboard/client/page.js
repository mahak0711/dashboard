"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redirect unauthorized users
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "CLIENT") {
      router.push("/dashboard/admin");
    }
  }, [session, status]);

  // Fetch user tickets
  useEffect(() => {
    async function fetchTickets() {
      const response = await fetch("/api/ticket");
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    }
    if (session?.user?.role === "CLIENT") {
      fetchTickets();
    }
  }, [session]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description) return alert("Description is required");
  
    setLoading(true);
  
    const ticketData = {
      description,
      priority,
    };
  
    console.log("Sending request with data:", ticketData); // Debugging
  
    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });
  
      const responseText = await response.text(); // Read response
      console.log("Response Status:", response.status);
      console.log("Response Body:", responseText);
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseText}`);
      }
  
      const newTicket = JSON.parse(responseText);
      setTickets([...tickets, newTicket]); // Update UI
      setDescription(""); // Clear form
      setPriority("LOW"); // Reset priority
    } catch (error) {
      console.error("Request failed:", error.message);
      alert("Failed to create ticket: " + error.message);
    }
  
    setLoading(false);
  }
  

  return (
    <div className="mt-20">
      <h1>Client Dashboard</h1>
      <h2>Create a Ticket</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue"
          required
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Ticket"}
        </button>
      </form>

      <h2>Your Tickets</h2>
      {tickets.length > 0 ? (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <strong>{ticket.description}</strong> - {ticket.status} ({ticket.priority})
            </li>
          ))}
        </ul>
      ) : (
        <p>No tickets created yet</p>
      )}
    </div>
  );
}

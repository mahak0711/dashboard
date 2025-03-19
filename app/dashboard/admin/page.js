"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const ADMIN_EMAIL = "mahak@admin.com";

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.email !== ADMIN_EMAIL) {
      router.push("/dashboard/client");
    }
  }, [session, status]);

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

  const handleCloseTicket = async (id) => {
    try {
      const response = await fetch(`/api/ticket/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ticket: ${response.status}`);
      }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === id ? { ...ticket, status: "closed" } : ticket
        )
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Filtering logic
  const filteredTickets = tickets.filter((ticket) => {
    return (
      (selectedPriority === "all" || ticket.priority === selectedPriority) &&
      (selectedStatus === "all" || ticket.status === selectedStatus) &&
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session || session.user.email !== ADMIN_EMAIL) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-28 space-y-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Admin Ticket Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter UI */}
          <div className="flex gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Tickets Table */}
          {filteredTickets.length === 0 ? (
            <p className="text-center text-gray-500">No tickets found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Priority</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.description}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`px-3 py-1 rounded text-white font-medium ${
                            ticket.priority.toLowerCase() === "high"
                              ? "bg-red-500"
                              : ticket.priority.toLowerCase() === "medium"
                              ? "bg-yellow-500 text-black"
                              : "bg-green-500"
                          }`}
                        >
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {ticket.status === "open" ? (
                          <span className="text-green-600 font-semibold">Open</span>
                        ) : (
                          <span className="text-gray-500 font-semibold">Closed</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {ticket.status === "open" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCloseTicket(ticket.id)}
                          >
                            Mark as Closed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // ShadCN Alert
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TriangleAlert } from "lucide-react"; // Icon for Alert

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTicket, setNewTicket] = useState({ description: "", priority: "" });

  // Redirect if not authorized
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user.role !== "CLIENT") {
      router.push("/dashboard/admin");
    }
  }, [session, status]);

  // Fetch tickets for the logged-in user
  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch("/api/ticket");
        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.role === "CLIENT") {
      fetchTickets();
    }
  }, [session]);

  // Handle ticket creation
  async function handleCreateTicket() {
    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        body: JSON.stringify(newTicket),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      const createdTicket = await response.json();
      setTickets((prev) => [createdTicket, ...prev]);
      setNewTicket({ description: "", priority: "" });
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center mt-18 space-y-6">
      <Card className="w-full max-w-4xl mt-20">
        <CardHeader>
          <CardTitle>Create a New Ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              placeholder="Enter ticket description"
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Priority</Label>
            <Select
              value={newTicket.priority}
              onValueChange={(value) =>
                setNewTicket({ ...newTicket, priority: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="low" className="bg-green-600">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="bg-yellow-300">
                    Medium
                  </SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* // value={newTicket.priority}
              // onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })} */}
          </div>
          <Button onClick={handleCreateTicket}>Submit</Button>
        </CardContent>
      </Card>

      {/* ShadCN Alert for errors (Below Ticket Card) */}
      {error && (
        <Alert variant="destructive" className="w-full max-w-2xl">
          <TriangleAlert className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tickets Table */}
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-center text-gray-500">No tickets found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Description</TableHead>
                    <TableHead className="text-center">Priority</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="w-1/2">
                        {ticket.description}
                      </TableCell>
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
                          {ticket.priority.charAt(0).toUpperCase() +
                            ticket.priority.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {ticket.status === "open" ? (
                          <span className="text-green-600 font-semibold">
                            Open
                          </span>
                        ) : (
                          <span className="text-gray-500 font-semibold">
                            Closed
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
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

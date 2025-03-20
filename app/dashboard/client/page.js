"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TriangleAlert } from "lucide-react";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTicket, setNewTicket] = useState({ description: "", priority: "low" });
  const [isCreating, setIsCreating] = useState(false);

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

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch("/api/ticket");
        if (!response.ok) throw new Error("Failed to fetch tickets");
        const data = await response.json();
        setTickets(data);
        setFilteredTickets(data);
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = tickets.filter((ticket) => {
        const matchesSearch = ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority =
          selectedPriority !== "all" ? ticket.priority.toLowerCase() === selectedPriority.toLowerCase() : true;
        const matchesStatus =
          selectedStatus !== "all" ? ticket.status.toLowerCase() === selectedStatus.toLowerCase() : true;
        return matchesSearch && matchesPriority && matchesStatus;
      });
      setFilteredTickets(filtered);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedPriority, selectedStatus, tickets]);

  async function handleSubmit() {
    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      const createdTicket = await response.json();
      setTickets((prev) => [...prev, createdTicket]);
      setFilteredTickets((prev) => [...prev, createdTicket]);
      setNewTicket({ description: "", priority: "low" });
      setIsCreating(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center mt-28 space-y-6">
      {/* Create Ticket Button */}
      <Button onClick={() => setIsCreating(true)}>Create Ticket</Button>

      {/* Ticket Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-lg p-6 bg-white rounded-lg">
            <CardHeader>
              <CardTitle>Create a New Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Description</Label>
              <Input
                type="text"
                placeholder="Enter ticket description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              />
              <Label>Priority</Label>
              <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="w-full max-w-2xl">
          <TriangleAlert className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input type="text" placeholder="Search tickets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
          {loading ? (
            <p>Loading tickets...</p>
          ) : filteredTickets.length === 0 ? (
            <p>No tickets found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.description}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-3 py-1 rounded text-white font-medium ${
                        ticket.priority.toLowerCase() === "high"
                          ? "bg-red-500"
                          : ticket.priority.toLowerCase() === "medium"
                          ? "bg-yellow-500 text-black"
                          : "bg-green-500"
                      }`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{ticket.status === "open" ? "🟢 Open" : "⚪ Closed"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

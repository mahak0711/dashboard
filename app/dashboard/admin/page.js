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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ADMIN_EMAIL = "admin@example.com";

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.email !== ADMIN_EMAIL) {
      router.push("/dashboard/client");
    }
  }, [session, status]);

  // Fetch all tickets
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

    if (session?.user?.email === ADMIN_EMAIL) {
      fetchTickets();
    }
  }, [session]);

  return (
    <div className="flex flex-col items-center mt-18 space-y-6">
      <Card className="w-full max-w-4xl mt-20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">All Tickets</CardTitle>
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
                      <TableCell className="w-1/2">{ticket.description}</TableCell>
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
                          <span className="text-green-600 font-semibold">Open</span>
                        ) : (
                          <span className="text-gray-500 font-semibold">Closed</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm">
                          Manage
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

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="w-full max-w-2xl">
          <TriangleAlert className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

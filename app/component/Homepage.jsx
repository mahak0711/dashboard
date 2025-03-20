"use client";

import { MacbookScroll } from "@/components/ui/macbook-scroll";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const { data: session } = useSession();
  const router = useRouter();  // Define router

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#000000] text-white px-6 pt-24">
      {/* Heading Section */}
      <div className="text-center mb-4">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
          Welcome Back!
        </h1>
      </div>

      {/* Buttons Container */}
      <div className="flex flex-col mt-8 px-8 gap-4 w-full max-w-sm pt-6">
        {/* Show Sign In button only if user is NOT logged in */}
        {!session && (
          <Link
            href="/sign-in"
            className="w-full text-center px-6 py-3 text-lg font-semibold bg-white text-gray-900 rounded-lg shadow-md transition-all transform hover:scale-105 hover:shadow-lg hover:bg-gray-100"
          >
            Sign In
          </Link>
        )}

        {/* Show Admin Dashboard button only if user is logged in */}
        {session && (
         <Button className="relative z-50" onClick={() => router.push(session?.user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/client")}>
         {session?.user?.role === "ADMIN" ? "Open My Admin" : "Manage Tickets"}
       </Button>
       
        )}
      </div>

      {/* Macbook Scroll Component */}
      <div className="mt-[-75px]">
        <MacbookScroll
          src="/images/demo.png" // Replace with actual image path
          showGradient={true}
          badge={<div className="bg-red-500 text-white p-2 rounded">New</div>}
        />
      </div>
    </div>
  );
}

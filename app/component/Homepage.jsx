"use client";

import Link from "next/link";

export default function Homepage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#434343]  to-[#000000] text-white px-6">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
          Welcome Back! 
        </h1>
        
      </div>

      {/* Buttons Container */}
      <div className="mt-10 flex flex-col gap-6 w-full max-w-sm">
        {/* Sign In Button */}
        <Link
          href="/sign-in"
          className="w-full text-center px-6 py-3 text-lg font-semibold bg-white text-gray-900 rounded-lg shadow-md transition-all transform hover:scale-105 hover:shadow-lg hover:bg-gray-100"
        >
          Sign In
        </Link>

        {/* Admin Button */}
        <Link href="/dashboard/admin">
          <button className="w-full px-6 py-3 text-lg font-semibold rounded-lg bg-black bg-opacity-50 shadow-md backdrop-blur-lg transition-all transform hover:scale-105 hover:bg-opacity-60">
            Open My Admin
          </button>
        </Link>
      </div>
    </div>
  );
}

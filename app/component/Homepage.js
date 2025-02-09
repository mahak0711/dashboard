"use client";

import Link from "next/link";

export default function Homepage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      {/* Sign In Button */}
      <Link
        href="/sign-in"
        className="px-6 py-3 mb-6 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
      >
        Sign In
      </Link>

      {/* Admin Button */}
      <Link href="/admin">
        <button className="px-6 py-3 text-lg font-medium text-white bg-amber-500 rounded-full shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
          Open My Admin
        </button>
      </Link>
    </div>
  );
}

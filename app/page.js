'use client'; // Mark this as a Client Component

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
     

      {session ? (
        <div className="text-center">
          <p className="mb-4">Signed in as {session.user.email}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">You are not signed in.</p>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-4"
          >
            Sign In
          </button>
          <Link
            href="/auth/signup"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
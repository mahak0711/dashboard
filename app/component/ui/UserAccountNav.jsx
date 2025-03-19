"use client"
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const UserAccountNav = () => {
  const { data: session } = useSession();

  if (!session) return null; // Don't render if not logged in

  return (
    <div className="flex items-center gap-4">
      {session.user?.image ? (
        <Image
          src={session.user.image}
          alt="Profile Picture"
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
      )}
                <span className="text-white font-medium">{session.user.name || "User"}</span>

      <button
        onClick={() => signOut({ redirect: true, callbackUrl: "/sign-in" })}
        className="bg-gray-600 px-4 py-2 rounded-3xl text-white hover:bg-gray-700 transition-all"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserAccountNav;

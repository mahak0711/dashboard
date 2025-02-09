import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../lib/auth";
import { signOut, useSession } from "next-auth/react";
import UserAccountNav from "./ui/UserAccountNav";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-3 z-50">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold text-gray-900">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Logo
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-6">
          {session?.user ? (
            <UserAccountNav />
          ) : (
            <Link
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-md transition-transform transform hover:scale-105"
              href="/sign-in"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

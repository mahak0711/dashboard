import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../lib/auth";
import UserAccountNav from "./ui/UserAccountNav";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md shadow-lg py-4 z-50">
    <div className="max-w-[1499px] mx-auto flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/" className="text-3xl font-bold">
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Logo
        </span>
      </Link>
  
      {/* Navigation */}
      <div className="flex items-center gap-4">
        {session?.user ? (
          <UserAccountNav />
        ) : (
          <Link
            href="/sign-in"
            className="px-6 py-2 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
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

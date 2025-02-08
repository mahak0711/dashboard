import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../lib/auth";
import { signOut, useSession } from "next-auth/react";
import UserAccountNav from "./ui/UserAccountNav";

const Navbar = async () => {
  
  
  const session = await getServerSession(authOptions);
  return (
    <div className=" bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between">
        <Link href="/">logo</Link>
        {session?.user ? (
         <UserAccountNav/>
        ) : (
          <Link
            className="bg-black rounded-3xl text-amber-50 w-20"
            href="/sign-in"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;

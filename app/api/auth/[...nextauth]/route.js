import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth";  // ✅ Ensure correct path

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
const prisma = new PrismaClient();
const authHandler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      session.user.phone = user.phone;
      return session;
    },
  },
});

// Export auth as the default function
export default authHandler;

// Named exports for other functions
export { authHandler as auth };

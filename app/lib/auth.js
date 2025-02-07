import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";  // ✅ Ensure correct path

export const authOptions = {
  pages: {
    signIn: '/sign-in'
  },
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const existingUser = await db.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        if (!existingUser) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password);
        if (!passwordMatch) {
          return null;
        }
        
        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email
        };
      }
    })
  ],
  callbacks:{
    async jwt({token,user}){
      if(user){
        return{
          ...token,
          username:user.username,
        }
      }
      return token
    },
    async session({session,token}){
      return{
        ...session,
        user:{
          ...session.user,
          username:token.username,
        }
      
      }
      return session
    },
  }
};

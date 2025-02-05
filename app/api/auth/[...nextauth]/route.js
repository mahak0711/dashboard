import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"; // Import CredentialsProvider
import { z } from "zod"; // If you're using zod for validation
import bcrypt from 'bcryptjs'; // Import bcrypt

const prisma = new PrismaClient();

// Define your validation schema (example with zod)
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6), // Minimum 6 characters for password
});

const authOptions = {
  adapter: PrismaAdapter(prisma),
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
      credentials: {
        email: {},
        password: {},
      },


      authorize: async (credentials) => {
        const validatedCredentials = schema.parse(credentials); // Validate inputs
        
        const user = await prisma.user.findFirst({
          where: {
            email: validatedCredentials.email,
          },
        });
      
        if (!user) {
          console.log('User not found');
          throw new Error("Invalid credentials.");
        }
      
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(validatedCredentials.password, user.password);
        console.log('Password valid:', isPasswordValid);
      
        if (!isPasswordValid) {
          console.log('Invalid password');
          throw new Error("Invalid credentials.");
        }
      
        return user;
      }
      
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await prisma.session.create({
          data: {
            sessionToken,
            userId: params.token.sub,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
          },
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      // Fallback to default JWT encoding
      return params.defaultEncode();
    },
  },
};

// Named exports for GET and POST
export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);

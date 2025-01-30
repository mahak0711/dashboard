import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    })

    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 })

  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 })
  }
}

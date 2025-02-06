'use client'

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function Homepage() {
return (
  <>
  <Link href='/sign-in'>
  SignIn
  </Link>
  </>
)
  
}
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
<br/>
  <Link href='/admin'><button className="bg-amber-500 h-10 rounded-4xl w-30 ">open My admin</button></Link>
  </>
)
  
}
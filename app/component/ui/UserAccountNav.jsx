'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

const UserAccountNav = () => {
  return (
    <>
     <button onClick={()=>{signOut ({
      redirect:true,
      callbackUrl:"/sign-in"
     })}} className="bg-black rounded-3xl text-amber-50 w-20">
            Sign Out{" "}
          </button>
    </>
  )
}

export default UserAccountNav

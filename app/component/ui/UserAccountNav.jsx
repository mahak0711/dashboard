'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

const UserAccountNav = () => {
  return (
    <div className="flex items-center">
     <button
  onClick={() => signOut({ redirect: true, callbackUrl: "/sign-in" })}
  className="bg-gray-600 px-4 py-2 rounded-3xl text-white hover:bg-gray-700 transition-all"
>
  Sign Out
</button>

    </div>
  );
};


export default UserAccountNav

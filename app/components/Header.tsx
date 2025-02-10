"use client"

import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
function Header() {

   const {data:session} = useSession()

   //handle signout
   const handleSignOut = async ()=>{
    try {
        //all session it deleted 
        await signOut()
    } catch (error) {
        
    }
   }

  return (
    <div>
        <button onClick={handleSignOut}>Signout</button>
        {session ?(<div>
            Welcome
        </div>):(
            <div>
                <Link href={"/login"}>Login</Link>
                <Link href={"/register"}>register</Link>
            </div>
        )}
    </div>
  )
}

export default Header
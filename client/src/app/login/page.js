"use client"
import React from "react";
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Login() {
  const { data: session } = useSession()

  if (!session) {

    return (
      <>
        <div>
          <button onClick={() => signIn('google')}>
            Login Google
          </button>
        </div>
        <div>
          <button onClick={() => signIn('github')}>
            Login Github
          </button>
        </div>
      </>

    )
  }
}

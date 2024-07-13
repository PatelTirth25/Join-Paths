"use client"
import { SessionProvider } from "next-auth/react"

export default function NextAuthWrapper({ session, children }) {

    return <SessionProvider session={session}>{children}</SessionProvider>
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { signOut, getCurrentUser } from "@/lib/auth"
import { Button } from "./button"

export function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = React.useState<any>(null)

    React.useEffect(() => {
        getCurrentUser().then(u => setUser(u))
    }, [pathname])

    const handleSignOut = async () => {
        await signOut()
        setUser(null)
        router.push("/")
    }

    // Do not show navbar fully on landing/login/register if we don't want,
    // but let's keep it simple and clean.

    return (
        <nav className="w-full absolute top-0 z-50 px-6 py-6 border-b border-transparent">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-xl font-medium tracking-tight text-zinc-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                    </span>
                    Garden
                </Link>
                <div>
                    {user ? (
                        <Button variant="ghost" className="text-zinc-500 font-medium hover:text-zinc-900" onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    ) : (
                        pathname !== '/login' && pathname !== '/register' && (
                            <div className="space-x-4">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-zinc-500 font-medium hover:text-zinc-900">Sign In</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="rounded-full shadow-sm">Get Started</Button>
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </nav>
    )
}

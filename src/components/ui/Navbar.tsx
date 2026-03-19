"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { signOut, getCurrentUser } from "@/lib/auth"
import { Button } from "./button"
import { Flower2 } from "lucide-react"

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

    return (
        <nav className="w-full absolute top-0 z-50 px-6 py-4 border-b border-transparent bg-white/50 backdrop-blur-md">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight text-green-800 flex items-center gap-2">
                    <Flower2 className="w-6 h-6 text-green-600" />
                    Mi Jardín
                </Link>
                <div>
                    {user ? (
                        <div className="space-x-4 flex items-center">
                            <Link href="/dashboard">
                                <Button className="bg-green-600 text-white hover:bg-green-700 rounded-full font-semibold shadow-md">
                                    Ir a mi flor
                                </Button>
                            </Link>
                            <Button variant="ghost" className="text-zinc-500 font-medium hover:text-zinc-900" onClick={handleSignOut}>
                                Salir
                            </Button>
                        </div>
                    ) : (
                        <div className="space-x-4 flex items-center">
                            <Link href="/login" className="hidden sm:inline-block">
                                <Button variant="ghost" className="text-green-800 font-medium hover:text-green-900 hover:bg-green-100/50">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-green-500 text-white hover:bg-green-600 rounded-full font-semibold shadow-md border border-green-400">
                                    Planta tu flor
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

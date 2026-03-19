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
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
        getCurrentUser().then(u => setUser(u))
    }, [pathname])

    // Solo mostrar contenido dependiente del usuario después que el componente esté montado
    const isLoggedIn = isMounted && !!user

    const handleSignOut = async () => {
        await signOut()
        setUser(null)
        router.push("/")
    }

    return (
        <nav className="w-full absolute top-0 z-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-transparent bg-white/50 backdrop-blur-md">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
                <Link href="/" className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-green-800 flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <span className="hidden sm:inline">Mi Jardín</span>
                </Link>
                <div>
                    {isLoggedIn ? (
                        <div className="space-x-2 sm:space-x-4 flex items-center">
                            <Link href="/dashboard">
                                <Button className="bg-green-600 text-white hover:bg-green-700 rounded-full font-semibold shadow-md text-xs sm:text-sm px-3 sm:px-6 h-9 sm:h-10">
                                    Mi flor
                                </Button>
                            </Link>
                            <Button variant="ghost" className="hidden sm:inline text-zinc-500 font-medium hover:text-zinc-900" onClick={handleSignOut}>
                                Salir
                            </Button>
                        </div>
                    ) : (
                        <div className="space-x-2 sm:space-x-4 flex items-center">
                            <Link href="/login" className="hidden sm:inline-block">
                                <Button variant="ghost" className="text-green-800 font-medium hover:text-green-900 hover:bg-green-100/50 text-sm">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-green-500 text-white hover:bg-green-600 rounded-full font-semibold shadow-md border border-green-400 text-xs sm:text-sm px-3 sm:px-6 h-9 sm:h-10">
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

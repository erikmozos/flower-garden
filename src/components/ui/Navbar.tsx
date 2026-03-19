"use client"

import * as React from "react"
import Link from "next/link"
import { Flower2, Sparkles } from "lucide-react"
import { getProfile } from "@/lib/auth"
import { getVisitorCookie } from "@/lib/cookies"
import { Button } from "./button"

interface NavbarProps {
    isShining?: boolean
    onToggleShine?: () => void
}

export function Navbar({ isShining: externalIsShining, onToggleShine }: NavbarProps) {
    const [visitorName, setVisitorName] = React.useState<string | null>(null)
    const [isMounted, setIsMounted] = React.useState(false)
    const [isShining, setIsShining] = React.useState(externalIsShining || false)

    React.useEffect(() => {
        setIsMounted(true)
        
        // Get visitor ID from cookie and fetch profile
        const visitorId = getVisitorCookie()
        if (visitorId) {
            getProfile(visitorId).then(profile => {
                if (profile) {
                    setVisitorName(profile.username)
                }
            })
        }

        // Listen for shine state changes from localStorage
        const handleStorageChange = () => {
            const shineState = localStorage.getItem('flower-shine') === 'true'
            setIsShining(shineState)
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const handleToggleShine = () => {
        const newState = !isShining
        setIsShining(newState)
        localStorage.setItem('flower-shine', String(newState))
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('shine-toggled', { detail: newState }))
        
        if (onToggleShine) {
            onToggleShine()
        }
    }

    return (
        <nav className="w-full absolute top-0 z-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-transparent bg-white/50 backdrop-blur-md">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
                <Link href="/" className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-green-800 flex items-center gap-1 sm:gap-2 shrink-0">
                    <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <span className="hidden sm:inline">Mi Jardín</span>
                </Link>
                {isMounted && visitorName && (
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-xs sm:text-sm text-green-700 font-medium">
                            Flor de {visitorName}
                        </div>
                        <Button
                            onClick={handleToggleShine}
                            className={`h-9 sm:h-10 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                                isShining
                                    ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-300'
                                    : 'bg-white/80 hover:bg-white text-pink-600 border border-pink-200'
                            }`}
                        >
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">{isShining ? 'Brilla' : 'Brillar'}</span>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    )
}

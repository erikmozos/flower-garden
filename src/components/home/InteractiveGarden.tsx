"use client"

import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FlowerRenderer } from "@/components/flower/FlowerRenderer"
import { getCurrentUser } from "@/lib/auth"
import { Flower } from "@/lib/types"
import { supabase } from "@/lib/supabaseClient"

interface InteractiveGardenProps {
    plantedFlowers: (Flower & { username: string | null })[]
}

function TooltipText({ text }: { text: string }) {
    const spanRef = useRef<HTMLSpanElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [shouldScroll, setShouldScroll] = useState(false)

    useEffect(() => {
        const checkOverflow = () => {
            if (spanRef.current && containerRef.current) {
                const isOverflowing = spanRef.current.scrollWidth > containerRef.current.clientWidth
                setShouldScroll(isOverflowing)
            }
        }

        checkOverflow()
        window.addEventListener('resize', checkOverflow)
        return () => window.removeEventListener('resize', checkOverflow)
    }, [text])

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
            <span
                ref={spanRef}
                className={`whitespace-nowrap ${shouldScroll ? 'animate-marquee' : ''}`}
            >
                {text}
            </span>
        </div>
    )
}

function getPlantedStyle(index: number, isLogged: boolean) {
    // Scatter horizontally between 5% and 90%
    const left = 5 + ((index * 17) % 85)
    // Scatter vertically along the grass between 2vh and Xvh
    // If logged in, grass is taller (up to 35vh vs 25vh), so we can scatter them higher
    const bottomMargin = isLogged ? 30 : 20
    const bottomOffset = isLogged ? 5 : 2
    const bottom = bottomOffset + ((index * 11) % bottomMargin)

    return {
        left: `${left}%`,
        bottom: `${bottom}vh`,
        transform: `scale(1)`,
        zIndex: Math.floor(40 - bottom) // lower bottom = closer = higher zIndex
    }
}

export function InteractiveGarden({ plantedFlowers }: InteractiveGardenProps) {
    const [user, setUser] = useState<any>(null)
    const [isMounted, setIsMounted] = useState(false)
    const [selectedFlowerId, setSelectedFlowerId] = useState<string | null>(null)

    useEffect(() => {
        setIsMounted(true)
        getCurrentUser().then(u => setUser(u))

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // No renderizar hasta que se monte en el cliente para evitar hydration mismatch
    const isLogged = isMounted && !!user

    const handleFlowerClick = (flowerId: string) => {
        setSelectedFlowerId(selectedFlowerId === flowerId ? null : flowerId)
    }

    const handleBackgroundClick = () => {
        setSelectedFlowerId(null)
    }

    return (
        <div className="fixed inset-0 w-full h-full bg-sky-100 overflow-hidden flex flex-col items-center justify-center animate-in fade-in duration-700" onClick={handleBackgroundClick}>

            {/* Sol */}
            <div className="absolute top-8 right-8 sm:top-16 sm:right-16 md:top-24 md:right-32 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.6)] sm:shadow-[0_0_90px_rgba(253,224,71,0.7)] md:shadow-[0_0_120px_rgba(253,224,71,0.8)] animate-pulse" />

            {/* Nubes simples */}
            <div className="absolute top-12 left-4 sm:top-24 sm:left-10 md:left-32 w-28 h-10 sm:w-40 sm:h-14 md:w-48 md:h-16 bg-white rounded-full opacity-80 blur-[1px]" />
            <div className="absolute top-8 left-12 sm:top-16 sm:left-24 md:left-48 w-20 h-12 sm:w-28 sm:h-16 md:w-32 md:h-20 bg-white rounded-full opacity-80 blur-[1px]" />
            <div className="absolute top-24 right-1/4 w-40 h-10 sm:w-52 sm:h-12 md:w-64 md:h-16 bg-white rounded-full opacity-60 blur-[1px]" />
            <div className="absolute top-16 right-1/3 w-28 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 bg-white rounded-full opacity-70 blur-[1px]" />

            {/* Colinas (Prado de fondo) - EFECTO AMPLIACION */}
            <div
                suppressHydrationWarning
                className={`absolute w-[85%] sm:w-[75%] md:w-[70%] bg-green-400 rounded-[100%] transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? "-bottom-10 -left-[5%] h-[50vh] sm:h-[55vh] md:h-[60vh] scale-105" : "-bottom-32 sm:-bottom-28 md:-bottom-32 -left-[10%] h-[40vh] sm:h-[45vh] md:h-[50vh] scale-100"
                    }`}
            />
            <div
                suppressHydrationWarning
                className={`absolute w-[85%] sm:w-[75%] md:w-[70%] bg-green-500 rounded-[100%] transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? "-bottom-16 -right-[5%] h-[60vh] sm:h-[65vh] md:h-[70vh] scale-105" : "-bottom-40 sm:-bottom-36 md:-bottom-40 -right-[10%] h-[50vh] sm:h-[55vh] md:h-[60vh] scale-100"
                    }`}
            />

            {/* Suelo frontal (Hierba) */}
            <div
                suppressHydrationWarning
                className={`absolute bottom-0 w-full bg-green-600 transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? "h-[30vh] sm:h-[32vh] md:h-[35vh]" : "h-[20vh] sm:h-[22vh] md:h-[25vh]"
                    }`}
            />

            {/* RENDERIZADO DE VERDADERAS FLORES PLANTADAS */}
            <div suppressHydrationWarning className={`absolute bottom-0 w-full overflow-visible transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? 'h-[30vh] sm:h-[32vh] md:h-[35vh]' : 'h-[20vh] sm:h-[22vh] md:h-[25vh]'}`}>
                {plantedFlowers.length === 0 ? (
                    <div className="absolute inset-x-0 bottom-[10vh] flex justify-center opacity-50 text-green-950 font-medium">
                        El jardín está esperando su primera semilla...
                    </div>
                ) : (
                    plantedFlowers.map((flower, i) => (
                        <div
                            key={flower.id}
                            suppressHydrationWarning
                            onClick={(e) => {
                                e.stopPropagation()
                                handleFlowerClick(flower.id)
                            }}
                            className={`absolute origin-bottom transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group cursor-pointer ${isLogged ? 'w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48' : 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32'}`}
                            style={getPlantedStyle(i, isLogged)}
                        >
                            <FlowerRenderer flower={flower} transparentBackground={true} className="!rounded-none" />

                            {/* Tooltip visible on hover and click/focus for mobile */}
                            <div className={`absolute -top-16 left-1/2 -translate-x-1/2 transition-opacity bg-white/90 backdrop-blur-sm text-green-900 text-xs sm:text-sm font-semibold px-4 sm:px-5 rounded-full shadow-lg border border-green-200 pointer-events-none z-50 w-[150px] sm:w-[170px] h-10 sm:h-11 flex items-center justify-center overflow-hidden ${selectedFlowerId === flower.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <TooltipText text={flower.username ? `Flor de ${flower.username}` : 'Explorador Anónimo'} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Contenido (Textos por encima del jardín central) */}
            <div
                suppressHydrationWarning
                className={`relative z-[100] space-y-6 sm:space-y-8 px-4 sm:px-6 text-center max-w-3xl bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white shadow-[0_0_20px_rgba(0,0,0,0.05)] sm:shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-all duration-1000 transform ${isLogged ? "opacity-0 scale-90 pointer-events-none -translate-y-20 mt-[-20vh]" : "opacity-100 scale-100 translate-y-0 mt-[-10vh]"
                    }`}
            >
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-green-950 drop-shadow-sm">
                    Tu Jardín Digital
                </h1>
                <p className="text-sm sm:text-lg md:text-2xl text-green-900 font-medium leading-relaxed">
                    Ya hay {plantedFlowers.length > 0 ? plantedFlowers.length : 'muchas'} flores plantadas. Regístrate para plantar tu flor eterna. Cada flor generada será inmutable y 100% tuya, creada en base a tu propia semilla.
                </p>
                <div className="pt-4 sm:pt-6 flex flex-col items-center justify-center gap-3 sm:gap-4">
                    <Link href="/register" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700 h-12 sm:h-14 md:h-16 px-8 sm:px-12 text-base sm:text-lg md:text-xl rounded-full shadow-xl sm:shadow-2xl transform transition hover:scale-105 active:scale-95">
                            Planta tu flor
                        </Button>
                    </Link>
                    <Link href="/login" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-green-600/30 text-green-800 bg-white/80 hover:bg-green-50 h-12 sm:h-14 md:h-16 px-8 sm:px-12 text-base sm:text-lg md:text-xl rounded-full backdrop-blur-md transform transition hover:scale-105 active:scale-95">
                            Ya tengo una flor
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

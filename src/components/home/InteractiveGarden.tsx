"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FlowerRenderer } from "@/components/flower/FlowerRenderer"
import { getCurrentUser } from "@/lib/auth"
import { Flower } from "@/lib/types"
import { supabase } from "@/lib/supabaseClient"

interface InteractiveGardenProps {
    plantedFlowers: (Flower & { username: string | null })[]
}

function getPlantedStyle(index: number, isLogged: boolean) {
    // Scatter horizontally between 5% and 90%
    const left = 5 + ((index * 17) % 85)
    // Scatter vertically along the grass between 2vh and Xvh
    // If logged in, grass is taller (up to 35vh vs 25vh), so we can scatter them higher
    const bottomMargin = isLogged ? 30 : 20
    const bottomOffset = isLogged ? 5 : 2
    const bottom = bottomOffset + ((index * 11) % bottomMargin)

    // Slight random scaling based on index
    const scale = 0.5 + ((index * 3) % 5) / 10 // 0.5 to 0.9

    return {
        left: `${left}%`,
        bottom: `${bottom}vh`,
        transform: `scale(${scale})`,
        zIndex: Math.floor(40 - bottom) // lower bottom = closer = higher zIndex
    }
}

export function InteractiveGarden({ plantedFlowers }: InteractiveGardenProps) {
    const [user, setUser] = useState<any>(undefined)

    useEffect(() => {
        getCurrentUser().then(u => setUser(u))

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const isLogged = !!user

    return (
        <div className="fixed inset-0 w-full h-full bg-sky-100 overflow-hidden flex flex-col items-center justify-center animate-in fade-in duration-700">

            {/* Sol */}
            <div className="absolute top-16 right-16 md:top-24 md:right-32 w-32 h-32 bg-yellow-300 rounded-full shadow-[0_0_120px_rgba(253,224,71,0.8)] animate-pulse" />

            {/* Nubes simples */}
            <div className="absolute top-24 left-10 md:left-32 w-48 h-16 bg-white rounded-full opacity-80 blur-[1px]" />
            <div className="absolute top-16 left-24 md:left-48 w-32 h-20 bg-white rounded-full opacity-80 blur-[1px]" />
            <div className="absolute top-40 right-1/4 w-64 h-16 bg-white rounded-full opacity-60 blur-[1px]" />
            <div className="absolute top-32 right-1/3 w-40 h-24 bg-white rounded-full opacity-70 blur-[1px]" />

            {/* Colinas (Prado de fondo) - EFECTO AMPLIACION */}
            <div
                className={`absolute w-[80%] md:w-[70%] bg-green-400 rounded-[100%] transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? "-bottom-10 -left-[5%] h-[60vh] scale-105" : "-bottom-32 -left-[10%] h-[50vh] scale-100"
                    }`}
            />
            <div
                className={`absolute w-[80%] md:w-[70%] bg-green-500 rounded-[100%] transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? "-bottom-16 -right-[5%] h-[70vh] scale-105" : "-bottom-40 -right-[10%] h-[60vh] scale-100"
                    }`}
            />

            {/* Suelo frontal (Hierba) */}
            <div
                className={`absolute bottom-0 w-full bg-green-600 transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? "h-[35vh]" : "h-[25vh]"
                    }`}
            />

            {/* RENDERIZADO DE VERDADERAS FLORES PLANTADAS */}
            <div className={`absolute bottom-0 w-full overflow-visible transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? 'h-[35vh]' : 'h-[25vh]'}`}>
                {plantedFlowers.length === 0 ? (
                    <div className="absolute inset-x-0 bottom-[10vh] flex justify-center opacity-50 text-green-950 font-medium">
                        El jardín está esperando su primera semilla...
                    </div>
                ) : (
                    plantedFlowers.map((flower, i) => (
                        <div
                            key={flower.id}
                            className={`absolute origin-bottom transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group cursor-pointer ${isLogged ? 'w-40 h-40 md:w-48 md:h-48' : 'w-32 h-32'}`}
                            style={getPlantedStyle(i, isLogged)}
                        >
                            <FlowerRenderer flower={flower} transparentBackground={true} className="!rounded-none" />

                            {/* Tooltip visible on hover and click/focus for mobile */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-green-900 text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg border border-green-200 pointer-events-none whitespace-nowrap z-50">
                                Flor de {flower.username || 'Explorador Anónimo'}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Contenido (Textos por encima del jardín central) */}
            <div
                className={`relative z-[100] space-y-8 px-6 text-center max-w-3xl bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-all duration-1000 transform ${isLogged ? "opacity-0 scale-90 pointer-events-none -translate-y-20 mt-[-20vh]" : "opacity-100 scale-100 translate-y-0 mt-[-10vh]"
                    }`}
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-green-950 drop-shadow-sm">
                    Tu Jardín Digital
                </h1>
                <p className="text-lg md:text-2xl text-green-900 font-medium leading-relaxed">
                    Ya hay {plantedFlowers.length > 0 ? plantedFlowers.length : 'muchas'} flores plantadas. Regístrate para plantar tu flor eterna. Cada flor generada será inmutable y 100% tuya, creada en base a tu propia semilla.
                </p>
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/register">
                        <Button size="lg" className="bg-green-600 text-white hover:bg-green-700 h-16 px-12 text-xl rounded-full shadow-2xl transform transition hover:scale-105 active:scale-95">
                            Planta tu flor
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="lg" className="border-green-600/30 text-green-800 bg-white/80 hover:bg-green-50 h-16 px-12 text-xl rounded-full backdrop-blur-md transform transition hover:scale-105 active:scale-95">
                            Ya tengo una flor
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

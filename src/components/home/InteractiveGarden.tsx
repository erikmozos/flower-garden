"use client"

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { FlowerRenderer } from "@/components/flower/FlowerRenderer"
import { Flower } from "@/lib/types"
import { getVisitorCookie } from "@/lib/cookies"
import NameInputModal from "@/components/home/NameInputModal"
import { generateMockGardenFlowers } from "@/lib/mockGardenFlowers"
import { getPlantedStyle, getStressTestPlantStyle } from "@/lib/gardenLayout"

const STRESS_TEST_DURATION_MS = 20_000
const STRESS_TEST_COUNT = 100

function showStressTestControl() {
    return (
        process.env.NODE_ENV === "development" ||
        process.env.NEXT_PUBLIC_GARDEN_STRESS_TEST === "1"
    )
}

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

export function InteractiveGarden({ plantedFlowers }: InteractiveGardenProps) {
    const [selectedFlowerId, setSelectedFlowerId] = useState<string | null>(null)
    const [showNameModal, setShowNameModal] = useState(false)
    const [visitorId, setVisitorId] = useState<string | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isShining, setIsShining] = useState(false)
    /** Vista previa temporal con 100 flores ficticias (solo desarrollo / flag público) */
    const [stressPreviewFlowers, setStressPreviewFlowers] = useState<
        (Flower & { username: string | null })[] | null
    >(null)
    const [stressSecondsLeft, setStressSecondsLeft] = useState(0)

    React.useEffect(() => {
        // Check if visitor has a cookie
        const cookie = getVisitorCookie()
        if (cookie) {
            setVisitorId(cookie)
            setShowNameModal(false)
        } else {
            // No cookie found, show modal to create first flower
            setShowNameModal(true)
        }
        setIsInitialized(true)
    }, [])

    // Listen for shine toggle events from Navbar
    React.useEffect(() => {
        const handleShineToggle = (event: CustomEvent) => {
            setIsShining(event.detail)
        }

        window.addEventListener('shine-toggled', handleShineToggle as EventListener)
        return () => window.removeEventListener('shine-toggled', handleShineToggle as EventListener)
    }, [])

    // Quitar la vista previa de 100 flores a los 20 s
    React.useEffect(() => {
        if (!stressPreviewFlowers) return
        const end = setTimeout(() => {
            setStressPreviewFlowers(null)
            setStressSecondsLeft(0)
        }, STRESS_TEST_DURATION_MS)
        return () => clearTimeout(end)
    }, [stressPreviewFlowers])

    // Cuenta atrás visual
    React.useEffect(() => {
        if (!stressPreviewFlowers) return
        setStressSecondsLeft(Math.ceil(STRESS_TEST_DURATION_MS / 1000))
        const tick = setInterval(() => {
            setStressSecondsLeft((s) => Math.max(0, s - 1))
        }, 1000)
        return () => clearInterval(tick)
    }, [stressPreviewFlowers])

    const startStressTest = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedFlowerId(null)
        setStressPreviewFlowers(generateMockGardenFlowers(STRESS_TEST_COUNT))
    }, [])

    const flowersToShow = useMemo(() => {
        if (stressPreviewFlowers && stressPreviewFlowers.length > 0) {
            return stressPreviewFlowers
        }
        return plantedFlowers
    }, [stressPreviewFlowers, plantedFlowers])

    const isStressPreview = Boolean(stressPreviewFlowers?.length)

    // No renderizar hasta que se monte en el cliente para evitar hydration mismatch
    const isLogged = isInitialized && !!visitorId

    /** Altura del prado (césped + flores) */
    const gardenLayerClass = isLogged
        ? "h-[54vh] sm:h-[56vh] md:h-[58vh]"
        : "h-[44vh] sm:h-[46vh] md:h-[48vh]"

    const handleFlowerClick = (flowerId: string) => {
        setSelectedFlowerId(selectedFlowerId === flowerId ? null : flowerId)
    }

    const handleBackgroundClick = () => {
        setSelectedFlowerId(null)
    }

    const handleModalSubmit = (userId: string) => {
        setVisitorId(userId)
        setShowNameModal(false)
    }

    return (
        <div className="fixed inset-0 w-full h-full bg-sky-100 overflow-hidden flex flex-col items-center justify-center animate-in fade-in duration-700" onClick={handleBackgroundClick}>

            {/* Modal para nombre de flor */}
            <NameInputModal 
                isOpen={showNameModal}
                onSubmit={handleModalSubmit}
            />

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
                className={`absolute w-[85%] sm:w-[75%] md:w-[70%] bg-green-400 rounded-[100%] transition-all duration-2000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? "-bottom-10 -left-[5%] h-[50vh] sm:h-[55vh] md:h-[60vh] scale-105" : "-bottom-32 sm:-bottom-28 md:-bottom-32 -left-[10%] h-[40vh] sm:h-[45vh] md:h-[50vh] scale-100"
                    }`}
            />
            <div
                suppressHydrationWarning
                className={`absolute w-[85%] sm:w-[75%] md:w-[70%] bg-green-500 rounded-[100%] transition-all duration-2000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isLogged ? "-bottom-16 -right-[5%] h-[60vh] sm:h-[65vh] md:h-[70vh] scale-105" : "-bottom-40 sm:-bottom-36 md:-bottom-40 -right-[10%] h-[50vh] sm:h-[55vh] md:h-[60vh] scale-100"
                    }`}
            />

            {/* Suelo frontal (Hierba) — franja más alta */}
            <div
                suppressHydrationWarning
                className={`absolute bottom-0 w-full bg-green-600 transition-all duration-2000 ease-[cubic-bezier(0.22,1,0.36,1)] ${gardenLayerClass}`}
            />

            {/* Banner vista previa 100 flores (test) */}
            {isStressPreview && (
                <div
                    className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-amber-100/95 border border-amber-300 text-amber-950 text-xs sm:text-sm font-semibold shadow-lg pointer-events-none"
                    role="status"
                >
                    Vista previa: {STRESS_TEST_COUNT} flores (demo) — quedan {stressSecondsLeft}s
                </div>
            )}

            {/* Control test (solo dev o NEXT_PUBLIC_GARDEN_STRESS_TEST=1) */}
            {showStressTestControl() && (
                <button
                    type="button"
                    onClick={startStressTest}
                    disabled={isStressPreview}
                    className="absolute bottom-4 left-4 z-[60] text-xs sm:text-sm px-3 py-2 rounded-xl bg-white/90 border border-green-200 text-green-900 font-medium shadow-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isStressPreview ? "Demo activa…" : `Probar ${STRESS_TEST_COUNT} flores (20s)`}
                </button>
            )}

            {/* Capa de flores: mismo alto que la hierba, ancho completo */}
            <div
                suppressHydrationWarning
                className={`absolute bottom-0 left-0 right-0 z-30 overflow-visible transition-all duration-2000 ease-[cubic-bezier(0.22,1,0.36,1)] ${gardenLayerClass}`}
            >
                <div className="relative h-full w-full">
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 top-[10%] bg-linear-to-t from-green-700 via-green-600 to-green-600/30"
                        aria-hidden
                    />

                    {!isStressPreview && plantedFlowers.length === 0 ? (
                        <div className="absolute inset-x-8 bottom-[18%] flex justify-center text-center text-sm text-green-950/70">
                            El jardín está esperando su primera semilla...
                        </div>
                    ) : flowersToShow.length === 0 ? null : (
                        flowersToShow.map((flower, i) => {
                        const isUserFlower =
                            !isStressPreview && isLogged && flower.user_id === visitorId
                        const plantStyle = isStressPreview
                            ? getStressTestPlantStyle(i, flowersToShow.length)
                            : getPlantedStyle(i, flowersToShow.length, isLogged)
                        return (
                        <div
                            key={flower.id}
                            suppressHydrationWarning
                            onClick={(e) => {
                                e.stopPropagation()
                                if (isStressPreview) return
                                handleFlowerClick(flower.id)
                            }}
                            className={`absolute origin-bottom transition-all duration-2000 ease-[cubic-bezier(0.22,1,0.36,1)] group ${isStressPreview ? "cursor-default" : "cursor-pointer"} ${isLogged ? 'w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48' : 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32'}`}
                            style={plantStyle}
                        >
                            <FlowerRenderer 
                                flower={flower} 
                                transparentBackground={true} 
                                className={`rounded-none! ${isUserFlower && isShining ? 'animate-flower-glow' : ''}`}
                            />

                            {/* Tooltip visible on hover and click/focus for mobile */}
                            <div className={`absolute -top-16 left-1/2 -translate-x-1/2 transition-opacity bg-white/90 backdrop-blur-sm text-green-900 text-xs sm:text-sm font-semibold px-4 sm:px-5 rounded-full shadow-lg border border-green-200 pointer-events-none z-50 w-37.5 sm:w-42.5 h-10 sm:h-11 flex items-center justify-center overflow-hidden ${isStressPreview ? 'opacity-0' : selectedFlowerId === flower.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <TooltipText text={flower.username ? `Flor de ${flower.username}` : 'Explorador Anónimo'} />
                            </div>
                        </div>
                        )
                    })
                    )}
                </div>
            </div>

            {/* Contenido (Textos por encima del jardín central) */}
            {/* <div
                suppressHydrationWarning
                className={`relative z-100 space-y-6 sm:space-y-8 px-4 sm:px-6 text-center max-w-3xl bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white shadow-[0_0_20px_rgba(0,0,0,0.05)] sm:shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-all duration-1000 transform ${isLogged ? "opacity-0 scale-90 pointer-events-none -translate-y-20 mt-[-20vh]" : "opacity-100 scale-100 translate-y-0 mt-[-10vh]"
                    }`}
            >
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-green-950 drop-shadow-sm">
                    Tu Jardín Digital
                </h1>
                <p className="text-sm sm:text-lg md:text-2xl text-green-900 font-medium leading-relaxed">
                    Hay {plantedFlowers.length} flores plantadas. Crea tu flor y mírala crecer en el jardín junto a las demás. Cada flor es única y eterna.
                </p>
            </div> */}
        </div>
    )
}

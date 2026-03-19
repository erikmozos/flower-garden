'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAnonymousProfile } from '@/lib/auth'
import { createAnonymousFlower } from '@/lib/flowers'
import { setVisitorCookie } from '@/lib/cookies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles } from 'lucide-react'

interface NameInputModalProps {
    isOpen: boolean
    onSubmit: (userId: string) => void
}

export default function NameInputModal({ isOpen, onSubmit }: NameInputModalProps) {
    const router = useRouter()
    const [flowerName, setFlowerName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!flowerName.trim()) {
            setError('Por favor ingresa un nombre')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // Create anonymous profile
            const profile = await createAnonymousProfile(flowerName.trim())
            if (!profile) throw new Error('No se pudo crear el perfil')

            // Create flower for the user
            await createAnonymousFlower(profile.id)

            // Set visitor cookie
            setVisitorCookie(profile.id)

            // Notify parent component
            onSubmit(profile.id)

            // Reload page to show new flower in garden
            router.refresh()
            setTimeout(() => {
                window.location.reload()
            }, 500)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Ocurrió un error, intenta de nuevo'
            )
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Efecto de entrada suave */}
            <div className="w-full max-w-sm animate-in fade-in zoom-in duration-300">
                {/* Card principal */}
                <div className="bg-linear-to-br from-white via-white to-green-50/30 rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                    {/* Header decorativo */}
                    <div className="bg-linear-to-r from-green-400 via-emerald-400 to-teal-400 px-6 sm:px-8 pt-8 sm:pt-10 pb-6 sm:pb-8">
                        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
                            <span className="text-2xl sm:text-3xl">🌸</span>
                            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center drop-shadow-md">
                            Crea tu Flor
                        </h2>
                    </div>

                    {/* Contenido */}
                    <div className="px-6 sm:px-8 py-8 sm:py-10">
                        <p className="text-center text-gray-600 text-sm sm:text-base mb-8 leading-relaxed font-medium">
                            Dale un nombre hermoso a tu flor. Será única y eterna en el jardín.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input con animación */}
                            <div className="space-y-3">
                                <label 
                                    htmlFor="flower-name"
                                    className="block text-sm sm:text-base font-semibold text-gray-700"
                                >
                                    Nombre de tu flor
                                </label>
                                <div className="relative">
                                    <Input
                                        id="flower-name"
                                        type="text"
                                        placeholder="Ej: Leo, Luna, Alex..."
                                        value={flowerName}
                                        onChange={(e) => {
                                            setFlowerName(e.target.value)
                                            setError('')
                                        }}
                                        disabled={isLoading}
                                        autoFocus
                                        maxLength={50}
                                        className="h-12 sm:h-13 px-4 sm:px-5 text-sm sm:text-base text-gray-900 placeholder-gray-400 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-white/80 disabled:bg-gray-100"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                                        {flowerName.length}/50
                                    </span>
                                </div>
                            </div>

                            {/* Mensaje de error */}
                            {error && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg px-4 py-3 flex gap-3">
                                        <div className="text-red-500 font-bold text-lg">⚠</div>
                                        <p className="text-red-700 text-sm sm:text-base font-medium">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Botón */}
                            <Button
                                type="submit"
                                disabled={isLoading || !flowerName.trim()}
                                className="w-full h-12 sm:h-13 bg-linear-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creando tu flor...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <span>✨</span>
                                        Crear mi flor
                                    </span>
                                )}
                            </Button>

                            {/* Hint */}
                            <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                                Podrás ver tu flor crecer en el jardín junto a las demás
                            </p>
                        </form>
                    </div>

                    {/* Footer decorativo */}
                    <div className="h-1 bg-linear-to-r from-green-400 via-emerald-400 to-teal-400" />
                </div>
            </div>
        </div>
    )
}

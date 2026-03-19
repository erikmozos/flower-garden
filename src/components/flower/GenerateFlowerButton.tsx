"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createFlowerForUser } from "@/lib/flowers"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface GenerateFlowerButtonProps {
    userId: string
    onSuccess?: () => void
}

export function GenerateFlowerButton({ userId, onSuccess }: GenerateFlowerButtonProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleGenerate = async () => {
        setLoading(true)
        setError(null)
        try {
            await createFlowerForUser(userId)
            router.refresh()
            if (onSuccess) onSuccess()
        } catch (err: any) {
            setError(err.message || 'Error generating flower')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <Button
                onClick={handleGenerate}
                disabled={loading}
                size="lg"
                className="w-full sm:w-auto h-16 rounded-3xl px-12 text-lg shadow-xl shadow-zinc-900/10 transition-all hover:scale-105 active:scale-95 group"
            >
                <Sparkles className="mr-3 h-5 w-5 group-hover:animate-pulse" />
                {loading ? "Discovering..." : "Generate my flower"}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}

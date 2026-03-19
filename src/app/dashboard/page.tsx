"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getCurrentUser, getProfile } from "@/lib/auth"
import { getFlowerByUserId } from "@/lib/flowers"
import { Flower, Profile } from "@/lib/types"
import { FlowerRenderer } from "@/components/flower/FlowerRenderer"
import { GenerateFlowerButton } from "@/components/flower/GenerateFlowerButton"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"

export default function DashboardPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [flower, setFlower] = useState<Flower | null>(null)

    const fetchData = async () => {
        try {
            const authUser = await getCurrentUser()
            if (!authUser) {
                router.push("/login")
                return
            }
            setUser(authUser)

            const [userProfile, userFlower] = await Promise.all([
                getProfile(authUser.id),
                getFlowerByUserId(authUser.id),
            ])

            setProfile(userProfile)
            setFlower(userFlower)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [router])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center animate-in fade-in duration-500 text-zinc-400 gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium">Loading your garden...</p>
            </div>
        )
    }

    if (!user) {
        return null // Will redirect
    }

    const displayName = profile?.username ? profile.username : user.email?.split('@')[0] || "Friend"

    return (
        <div className="w-full px-3 sm:px-4 flex flex-col items-center text-center space-y-8 sm:space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-full flex justify-start">
                <Link href="/">
                    <Button variant="ghost" className="gap-2 text-green-700 hover:text-green-900 hover:bg-green-50/50 pl-0 sm:pl-2 text-xs sm:text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Volver al jardín</span>
                        <span className="sm:hidden">Atrás</span>
                    </Button>
                </Link>
            </div>

            <div className="space-y-2 sm:space-y-4">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
                    Hello, {displayName}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-zinc-500">
                    Welcome to your personal serene space.
                </p>
            </div>

            <div className="w-full flex flex-col items-center">
                {flower ? (
                    <div className="w-full space-y-6 sm:space-y-8 flex flex-col items-center">
                        <h2 className="text-base sm:text-lg md:text-xl font-medium tracking-tight text-zinc-800">This is your unique digital flower</h2>
                        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md shadow-lg sm:shadow-xl md:shadow-2xl shadow-zinc-900/5 rounded-2xl sm:rounded-[2.5rem]">
                            <FlowerRenderer flower={flower} />
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-xs sm:max-w-sm p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2.5rem] border border-zinc-100 bg-white shadow-lg sm:shadow-xl md:shadow-2xl shadow-zinc-900/5 flex flex-col items-center text-center space-y-6 sm:space-y-8">
                        <div className="space-y-2 sm:space-y-3">
                            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900">Your seed is waiting</h2>
                            <p className="text-xs sm:text-sm md:text-[15px] text-zinc-500 leading-relaxed">
                                You haven&apos;t grown your flower yet. Generating it will permanently create a unique, immutable flower derived from an exclusive seed just for you.
                            </p>
                        </div>
                        <GenerateFlowerButton
                            userId={user.id}
                            onSuccess={() => fetchData()}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

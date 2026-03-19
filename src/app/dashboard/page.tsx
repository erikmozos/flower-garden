"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getProfile } from "@/lib/auth"
import { getFlowerByUserId } from "@/lib/flowers"
import { Flower, Profile } from "@/lib/types"
import { FlowerRenderer } from "@/components/flower/FlowerRenderer"
import { GenerateFlowerButton } from "@/components/flower/GenerateFlowerButton"
import { Loader2 } from "lucide-react"

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
        <div className="w-full max-w-2xl px-4 flex flex-col items-center text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
                    Hello, {displayName}
                </h1>
                <p className="text-lg text-zinc-500">
                    Welcome to your personal serene space.
                </p>
            </div>

            <div className="w-full flex flex-col items-center">
                {flower ? (
                    <div className="w-full space-y-8 flex flex-col items-center">
                        <h2 className="text-xl font-medium tracking-tight text-zinc-800">This is your unique digital flower</h2>
                        <div className="w-full max-w-[400px] shadow-2xl shadow-zinc-900/5 rounded-[2.5rem]">
                            <FlowerRenderer flower={flower} />
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md p-12 rounded-[2.5rem] border border-zinc-100 bg-white shadow-xl shadow-zinc-900/5 flex flex-col items-center text-center space-y-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-semibold text-zinc-900">Your seed is waiting</h2>
                            <p className="text-zinc-500 leading-relaxed text-[15px]">
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

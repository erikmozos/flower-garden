"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface AuthFormProps {
    mode: "login" | "register"
}

export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const isLogin = mode === "login"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (isLogin) {
                await signIn(email, password)
                router.push("/dashboard")
                router.refresh()
            } else {
                await signUp(email, password, username)
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="text-center px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-2xl sm:text-3xl">{isLogin ? "Welcome back" : "Create an account"}</CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-2">
                    {isLogin
                        ? "Enter your credentials to access your garden"
                        : "Sign up to discover your unique digital flower"}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 px-4 sm:px-6">
                    {!isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-xs sm:text-sm">Nombre o Apodo</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Tu nombre..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={!isLogin}
                                disabled={loading}
                                className="text-sm"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="text-sm"
                        />
                    </div>
                    {error && <p className="text-xs sm:text-sm text-red-500 font-medium">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                    <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading} size="lg">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLogin ? "Sign In" : "Sign Up"}
                    </Button>
                    <div className="text-xs sm:text-sm text-center text-zinc-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <Button
                            variant="link"
                            className="p-0 h-auto font-semibold text-zinc-900 text-xs sm:text-sm"
                            onClick={(e) => {
                                e.preventDefault()
                                router.push(isLogin ? "/register" : "/login")
                            }}
                            disabled={loading}
                        >
                            {isLogin ? "Sign Up" : "Sign In"}
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}

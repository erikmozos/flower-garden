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
                await signUp(email, password)
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
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle>{isLogin ? "Welcome back" : "Create an account"}</CardTitle>
                <CardDescription>
                    {isLogin
                        ? "Enter your credentials to access your garden"
                        : "Sign up to discover your unique digital flower"}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={loading} size="lg">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLogin ? "Sign In" : "Sign Up"}
                    </Button>
                    <div className="text-sm text-center text-zinc-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <Button
                            variant="link"
                            className="p-0 h-auto font-semibold text-zinc-900"
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

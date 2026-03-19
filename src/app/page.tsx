import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-both">
      <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium">
        <Sparkles className="mr-2 h-4 w-4 text-zinc-500" />
        <span className="text-zinc-600">Discover your unique digital identity</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-zinc-950 max-w-3xl">
        Every seed grows a <br className="hidden md:block" /> unique story.
      </h1>

      <p className="text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed">
        Join our garden. Once you register, a single eternal digital flower will be generated for you based on a unique seed. Unrepeatable. Immutable. Yours.
      </p>

      <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        <Link href="/register" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto sm:px-12 h-14 rounded-full text-lg shadow-xl shadow-zinc-900/10">
            Get Started
          </Button>
        </Link>
        <Link href="/login" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto sm:px-12 h-14 rounded-full text-lg bg-transparent">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  )
}

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-zinc-900 text-white shadow hover:bg-zinc-900/90": variant === "default",
                        "border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100": variant === "outline",
                        "hover:bg-zinc-100": variant === "ghost",
                        "text-zinc-900 underline-offset-4 hover:underline": variant === "link",
                        "h-10 px-6 py-2": size === "default",
                        "h-8 rounded-full px-3 text-xs": size === "sm",
                        "h-12 rounded-full px-8 text-base": size === "lg",
                        "h-9 w-9": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }

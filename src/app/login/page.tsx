import { AuthForm } from "@/components/auth/AuthForm"

export default function LoginPage() {
    return (
        <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
            <AuthForm mode="login" />
        </div>
    )
}

import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
      <div className="flex w-full max-w-2xl justify-center">
        <LoginForm />
      </div>
    </div>
  )
}
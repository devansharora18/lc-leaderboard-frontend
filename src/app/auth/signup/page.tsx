import SignUpForm from "@/components/auth/signup-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
      <div className="flex w-full max-w-2xl justify-center">
        <SignUpForm />
      </div>
    </div>
  )
}
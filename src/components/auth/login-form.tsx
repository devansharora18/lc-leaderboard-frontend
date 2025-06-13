"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/hooks/useLogin"
import { useAuth } from "@/contexts/auth.context"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginForm() {
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  })

  const { login, isLoading, error, clearError } = useLogin()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/") // Redirect to home or dashboard after successful login
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError()
  }, [clearError])

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignInData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) {
      clearError()
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!signInData.email || !signInData.password) {
      return
    }

    const result = await login({
      email: signInData.email,
      password: signInData.password,
    })

    if (result.success) {
      // Success handling is done in useEffect above
      toast.success("Welcome back! Login successful.")
    }
  }

  return (
    <div className="w-full rounded-3xl bg-zinc-800 p-8 md:max-w-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-white">Sign In</h1>
      <p className="mb-6 text-center text-sm text-zinc-400">
        New here?{" "}
        <Link href="/auth/signup" className="text-[#D7FE66] hover:underline">
          Sign up
        </Link>
      </p>

      <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 py-2 text-sm text-white transition hover:bg-zinc-700">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        Sign in with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-zinc-800 px-2 text-zinc-400">or</span>
        </div>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-900/20 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
        
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={signInData.email}
          onChange={handleSignInChange}
          required
          disabled={isLoading}
          className="rounded-md border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={signInData.password}
          onChange={handleSignInChange}
          required
          disabled={isLoading}
          className="rounded-md border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading || !signInData.email || !signInData.password}
            className="w-full rounded-md bg-[#D7FE66] py-2 font-medium text-black hover:bg-[#c7ee56] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D7FE66]"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  )
}

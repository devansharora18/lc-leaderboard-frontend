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
      // Check if there's a stored redirect path
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else {
        router.push("/"); // Default redirect to dashboard after successful login
      }
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
      toast.error("Please enter your email and password")
      return
    }

    const result = await login({
      email: signInData.email,
      password: signInData.password,
    })

    if (result.success) {
      // Success handling is done in useEffect above
      toast.success("Welcome back! Login successful.")
    } else {
      toast.error(result.error || "Login failed")
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

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSignup } from "@/hooks/useSignup"
import { useAuth } from "@/contexts/auth.context"
import { toast } from "sonner"
import Link from "next/link"

export default function SignUpForm() {
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const { signup, isLoading, error, clearError } = useSignup()
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
        router.push("/dashboard"); // Default redirect to dashboard after successful signup
      }
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError()
  }, [clearError])

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignUpData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) {
      clearError()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!signUpData.username || !signUpData.email || !signUpData.password) {
      return
    }

    const result = await signup({
      username: signUpData.username,
      email: signUpData.email,
      password: signUpData.password,
    })

    if (result.success) {
      // Success handling is done in useEffect above
      toast.success("Account created successfully! Welcome aboard!")
    }
  }

  return (
    <div className="w-full rounded-3xl bg-zinc-800 p-8 md:max-w-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-white">Sign Up</h1>
      <p className="mb-6 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#D7FE66] hover:underline">
          Sign in
        </Link>
      </p>

      

      <form onSubmit={handleSignUp} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-900/20 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
        
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={signUpData.username}
          onChange={handleSignUpChange}
          required
          disabled={isLoading}
          className="rounded-md border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={signUpData.email}
          onChange={handleSignUpChange}
          required
          disabled={isLoading}
          className="rounded-md border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={signUpData.password}
          onChange={handleSignUpChange}
          required
          disabled={isLoading}
          className="rounded-md border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading || !signUpData.username || !signUpData.email || !signUpData.password}
            className="w-full rounded-md bg-[#D7FE66] py-2 font-medium text-black hover:bg-[#c7ee56] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D7FE66]"
          >
            {isLoading ? "Creating Account..." : "Get Started"}
          </Button>
        </div>
      </form>
    </div>
  )
}

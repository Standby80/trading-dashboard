'use client'

import { useState } from 'react'
import { signup } from '../login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e14] text-slate-50 font-sans p-4">
      <div className="w-full max-w-md space-y-8 bg-[#131823] p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
          <p className="text-sm text-slate-400 mt-2">Start analyzing your trades today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@example.com" 
              required 
              className="bg-[#0b0e14] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-[#0b0e14] border-white/10 text-white focus-visible:ring-indigo-500"
            />
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

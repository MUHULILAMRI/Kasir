"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { ShoppingCart, AlertCircle } from "lucide-react"

interface UserData {
  id: number
  name: string
  username: string
  password: string
  role: "admin" | "cashier"
  status: "active" | "inactive"
  lastLogin: string
  shift: string
  phone: string
}

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [users, setUsers] = useState<UserData[]>([])
  const router = useRouter()

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("alfapos_users")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      // Default users if none exist
      const defaultUsers: UserData[] = [
        {
          id: 1,
          name: "Admin System",
          username: "admin",
          password: "123456",
          role: "admin",
          status: "active",
          lastLogin: "Belum pernah login",
          shift: "Full Time",
          phone: "081234567890",
        },
        {
          id: 2,
          name: "Budi Santoso",
          username: "kasir1",
          password: "123456",
          role: "cashier",
          status: "active",
          lastLogin: "Belum pernah login",
          shift: "Pagi (08:00-16:00)",
          phone: "081234567891",
        },
      ]
      localStorage.setItem("alfapos_users", JSON.stringify(defaultUsers))
      setUsers(defaultUsers)
    }
  }, [])

  const handleLogin = () => {
    setError("")

    if (!username || !password) {
      setError("Username dan password harus diisi")
      return
    }

    const user = users.find((u) => u.username === username && u.password === password && u.status === "active")

    if (!user) {
      setError("Username atau password salah, atau akun tidak aktif")
      return
    }

    // Update last login
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, lastLogin: new Date().toLocaleString("id-ID") } : u,
    )
    localStorage.setItem("alfapos_users", JSON.stringify(updatedUsers))

    // Save current user session
    localStorage.setItem("alfapos_current_user", JSON.stringify(user))

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/cashier")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AlfaPOS</h1>
          <p className="text-blue-100">Sistem Point of Sale Modern</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-white">Masuk ke Sistem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center space-x-2 text-red-300 bg-red-500/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>

            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Masuk
            </Button>

            <div className="text-center text-sm text-blue-100 space-y-2">
              <p className="font-semibold">Akun Demo:</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-white/10 p-2 rounded">
                  <p className="font-medium">Admin</p>
                  <p>admin / 123456</p>
                </div>
                <div className="bg-white/10 p-2 rounded">
                  <p className="font-medium">Kasir</p>
                  <p>kasir1 / 123456</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

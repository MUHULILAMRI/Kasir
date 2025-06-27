"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Users, Shield, User, Clock } from "lucide-react"

interface UserData {
  id: number
  name: string
  username: string
  role: "admin" | "cashier"
  status: "active" | "inactive"
  lastLogin: string
  shift: string
  phone: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])

  useEffect(() => {
    const savedUsers = localStorage.getItem("alfapos_users")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }
  }, [])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    role: "cashier" as "admin" | "cashier",
    status: "active" as "active" | "inactive",
    shift: "",
    phone: "",
    password: "",
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleSubmit = () => {
    let updatedUsers: UserData[]

    if (editingUser) {
      updatedUsers = users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              ...formData,
              password: formData.password || (u as any).password, // Keep old password if not changed
            }
          : u,
      )
    } else {
      const newUser: UserData = {
        id: Date.now(),
        ...formData,
        lastLogin: "Belum pernah login",
      }
      updatedUsers = [...users, newUser]
    }

    setUsers(updatedUsers)
    localStorage.setItem("alfapos_users", JSON.stringify(updatedUsers))

    setFormData({
      name: "",
      username: "",
      role: "cashier",
      status: "active",
      shift: "",
      phone: "",
      password: "",
    })
    setEditingUser(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (user: UserData) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      username: user.username,
      role: user.role,
      status: user.status,
      shift: user.shift,
      phone: user.phone,
      password: "",
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    const updatedUsers = users.filter((u) => u.id !== id)
    setUsers(updatedUsers)
    localStorage.setItem("alfapos_users", JSON.stringify(updatedUsers))
  }

  const toggleStatus = (id: number) => {
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u,
    )
    setUsers(updatedUsers)
    localStorage.setItem("alfapos_users", JSON.stringify(updatedUsers))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? "Kosongkan jika tidak ingin mengubah" : ""}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "cashier") => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cashier">Kasir</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="shift">Shift</Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pagi (08:00-16:00)">Pagi (08:00-16:00)</SelectItem>
                    <SelectItem value="Siang (16:00-24:00)">Siang (16:00-24:00)</SelectItem>
                    <SelectItem value="Malam (00:00-08:00)">Malam (00:00-08:00)</SelectItem>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">No. Telepon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingUser ? "Update Pengguna" : "Tambah Pengguna"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari nama atau username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cashier">Kasir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      user.role === "admin" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.role === "admin" ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>
                <Badge variant={user.status === "active" ? "default" : "secondary"}>
                  {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Role:</span>
                <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                  {user.role === "admin" ? "Admin" : "Kasir"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Shift:</span>
                <span className="text-sm font-medium">{user.shift}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Telepon:</span>
                <span className="text-sm font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Login terakhir: {user.lastLogin}</span>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(user)} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleStatus(user.id)}
                  className={
                    user.status === "active"
                      ? "text-orange-600 hover:text-orange-700"
                      : "text-green-600 hover:text-green-700"
                  }
                >
                  {user.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Tidak ada pengguna yang ditemukan</p>
        </div>
      )}
    </div>
  )
}

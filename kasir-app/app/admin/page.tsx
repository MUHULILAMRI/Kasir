"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Package, Users, DollarSign, ShoppingCart, AlertTriangle, Clock } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Penjualan Hari Ini",
      value: "Rp 2,450,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Transaksi",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Produk Terjual",
      value: "324",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Pelanggan",
      value: "89",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  const recentTransactions = [
    { id: "TRX001", time: "10:30", items: 5, total: "Rp 125,000", cashier: "Budi" },
    { id: "TRX002", time: "10:25", items: 3, total: "Rp 75,500", cashier: "Sari" },
    { id: "TRX003", time: "10:20", items: 8, total: "Rp 245,000", cashier: "Budi" },
    { id: "TRX004", time: "10:15", items: 2, total: "Rp 45,000", cashier: "Andi" },
  ]

  const lowStockProducts = [
    { name: "Indomie Goreng", stock: 5, min: 20 },
    { name: "Aqua 600ml", stock: 8, min: 50 },
    { name: "Teh Botol Sosro", stock: 12, min: 30 },
    { name: "Roti Tawar", stock: 3, min: 15 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Update terakhir: {new Date().toLocaleTimeString("id-ID")}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Transaksi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{transaction.id}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.time} • {transaction.items} item • Kasir: {transaction.cashier}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{transaction.total}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              Lihat Semua Transaksi
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">Minimum: {product.min}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="bg-orange-600">
                      {product.stock} tersisa
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              Kelola Stok
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

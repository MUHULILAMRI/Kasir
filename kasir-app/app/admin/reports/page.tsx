"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Eye,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react"

export default function ReportsPage() {
  const salesData = [
    { date: "2024-01-15", transactions: 45, revenue: 1250000, items: 156, customers: 38 },
    { date: "2024-01-14", transactions: 52, revenue: 1450000, items: 178, customers: 42 },
    { date: "2024-01-13", transactions: 38, revenue: 980000, items: 134, customers: 31 },
    { date: "2024-01-12", transactions: 61, revenue: 1680000, items: 203, customers: 48 },
    { date: "2024-01-11", transactions: 43, revenue: 1180000, items: 145, customers: 36 },
  ]

  const topProducts = [
    { name: "Indomie Goreng", sold: 234, revenue: 819000, growth: 12.5 },
    { name: "Aqua 600ml", sold: 189, revenue: 567000, growth: -3.2 },
    { name: "Teh Botol Sosro", sold: 156, revenue: 702000, growth: 8.7 },
    { name: "Chitato", sold: 98, revenue: 833000, growth: 15.3 },
    { name: "Oreo", sold: 87, revenue: 1044000, growth: 22.1 },
  ]

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Laporan Penjualan</h1>
        <div className="flex items-center space-x-3">
          <Select defaultValue="7days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="7days">7 Hari Terakhir</SelectItem>
              <SelectItem value="30days">30 Hari Terakhir</SelectItem>
              <SelectItem value="custom">Periode Kustom</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Penjualan</p>
                <p className="text-2xl font-bold">Rp 6.86M</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+12.5%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Transaksi</p>
                <p className="text-2xl font-bold">239</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+8.2%</span>
                </div>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Item Terjual</p>
                <p className="text-2xl font-bold">816</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span className="text-sm">-2.1%</span>
                </div>
              </div>
              <Package className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Pelanggan</p>
                <p className="text-2xl font-bold">195</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+15.3%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Penjualan Harian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{formatDate(day.date)}</p>
                    <p className="text-sm text-gray-600">
                      {day.transactions} transaksi • {day.items} item • {day.customers} pelanggan
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(day.revenue)}</p>
                    <Button variant="ghost" size="sm" className="mt-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Produk Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sold} terjual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(product.revenue)}</p>
                    <div className="flex items-center mt-1">
                      {product.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                      )}
                      <Badge variant={product.growth > 0 ? "default" : "destructive"} className="text-xs">
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

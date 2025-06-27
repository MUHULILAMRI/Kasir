"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, LogOut, User, Clock, CreditCard, Smartphone, Banknote } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  barcode: string
}

interface CartItem extends Product {
  quantity: number
}

const productCatalog: Product[] = [
  { id: 1, name: "Indomie Goreng", category: "Makanan", price: 3500, image: "🍜", barcode: "8992388123456" },
  { id: 2, name: "Aqua 600ml", category: "Minuman", price: 3000, image: "💧", barcode: "8993675123456" },
  { id: 3, name: "Teh Botol Sosro", category: "Minuman", price: 4500, image: "🍵", barcode: "8992761123456" },
  { id: 4, name: "Chitato", category: "Snack", price: 8500, image: "🥔", barcode: "8992761234567" },
  { id: 5, name: "Oreo", category: "Snack", price: 12000, image: "🍪", barcode: "8992761345678" },
  { id: 6, name: "Susu Ultra", category: "Minuman", price: 15000, image: "🥛", barcode: "8992761456789" },
  { id: 7, name: "Roti Tawar", category: "Makanan", price: 8000, image: "🍞", barcode: "8992761567890" },
  { id: 8, name: "Minyak Goreng", category: "Kebutuhan", price: 25000, image: "🛢️", barcode: "8992761678901" },
]

export default function CashierPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [paymentModal, setPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [cashReceived, setCashReceived] = useState("")
  const [orderId, setOrderId] = useState(1001)
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("alfapos_current_user")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    } else {
      // Redirect to login if no user session
      router.push("/")
    }
  }, [router])

  const categories = ["all", ...new Set(productCatalog.map((p) => p.category))]

  const filteredProducts = productCatalog.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm)
    return matchesCategory && matchesSearch
  })

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)

  const addToCart = (productId: number) => {
    const existingItem = cart.find((item) => item.id === productId)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      const product = productCatalog.find((p) => p.id === productId)
      if (product) {
        setCart([...cart, { ...product, quantity: 1 }])
      }
    }
  }

  const updateQuantity = (index: number, change: number) => {
    const newCart = [...cart]
    newCart[index].quantity += change
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1)
    }
    setCart(newCart)
  }

  const removeItem = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax
  const change = Number.parseFloat(cashReceived) - total

  const processPayment = () => {
    const receiptData = {
      orderId,
      items: cart,
      subtotal,
      tax,
      total,
      paymentMethod,
      cashReceived: paymentMethod === "cash" ? Number.parseFloat(cashReceived) : total,
      change: paymentMethod === "cash" ? change : 0,
      timestamp: new Date(),
    }

    // Simulate printing receipt
    console.log("Printing receipt:", receiptData)
    alert(
      `Pembayaran berhasil!\nTotal: ${formatCurrency(total)}\nMetode: ${paymentMethod === "cash" ? "Tunai" : paymentMethod === "card" ? "Kartu" : "QRIS"}`,
    )

    setCart([])
    setPaymentModal(false)
    setOrderId(orderId + 1)
    setCashReceived("")
  }

  const handleLogout = () => {
    localStorage.removeItem("alfapos_current_user")
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left Panel - Products */}
      <div className="w-7/12 flex flex-col bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold">Kasir: {currentUser?.name || "Loading..."}</h2>
                <p className="text-sm opacity-90">Shift: {currentUser?.shift || "Loading..."}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm opacity-90">Waktu</p>
                <p className="font-bold">{new Date().toLocaleTimeString("id-ID")}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-white border-white/30 hover:bg-white/20 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>

          <Input
            type="text"
            placeholder="Scan barcode atau cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
          />
        </div>

        {/* Category Tabs */}
        <div className="p-4 border-b bg-gray-50 flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm rounded-full whitespace-nowrap ${
                activeCategory === category ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white hover:bg-gray-100"
              }`}
            >
              {category === "all" ? "Semua" : category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 border-2 hover:border-blue-300"
                onClick={() => addToCart(product.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{product.image}</div>
                  <h3 className="font-semibold text-sm leading-tight h-10 flex items-center justify-center">
                    {product.name}
                  </h3>
                  <Badge variant="secondary" className="mt-2 mb-2">
                    {product.category}
                  </Badge>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-5/12 bg-white flex flex-col shadow-2xl">
        {/* Cart Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Pesanan #{orderId}</h2>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{new Date().toLocaleTimeString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-lg">Keranjang kosong</p>
              <p className="text-sm">Pilih produk untuk memulai transaksi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <div className="text-2xl">{item.image}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(index, -1)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-bold w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(index, 1)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Section */}
        <div className="p-4 border-t bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} item)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pajak (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-green-600 pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <Button
            onClick={() => setPaymentModal(true)}
            disabled={cart.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 h-auto disabled:bg-gray-300"
          >
            Bayar Sekarang
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentModal} onOpenChange={setPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Pembayaran</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Total Display */}
            <div className="text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-lg">
              <p className="text-sm opacity-90">Total Pembayaran</p>
              <p className="text-3xl font-bold">{formatCurrency(total)}</p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <p className="font-semibold">Pilih Metode Pembayaran:</p>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Banknote className="w-6 h-6 mb-2" />
                  <span className="text-xs">Tunai</span>
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <CreditCard className="w-6 h-6 mb-2" />
                  <span className="text-xs">Kartu</span>
                </Button>
                <Button
                  variant={paymentMethod === "qris" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("qris")}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Smartphone className="w-6 h-6 mb-2" />
                  <span className="text-xs">QRIS</span>
                </Button>
              </div>
            </div>

            {/* Cash Payment Section */}
            {paymentMethod === "cash" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Uang Diterima</label>
                  <Input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="text-lg p-3 mt-1"
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Kembalian:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(change > 0 ? change : 0)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPaymentModal(false)} className="flex-1">
                Batal
              </Button>
              <Button
                onClick={processPayment}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={paymentMethod === "cash" && (Number.parseFloat(cashReceived) < total || !cashReceived)}
              >
                Konfirmasi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

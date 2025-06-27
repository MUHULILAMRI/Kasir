"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Package, AlertCircle } from "lucide-react"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  barcode: string
  description: string
  image: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Indomie Goreng",
      category: "Makanan",
      price: 3500,
      stock: 10,
      minStock: 20,
      barcode: "8992388123456",
      description: "Mie instan rasa ayam bawang",
      image: "🍜",
    },
    {
      id: 2,
      name: "Aqua 600ml",
      category: "Minuman",
      price: 3000,
      stock: 8,
      minStock: 10,
      barcode: "8993675123456",
      description: "Air mineral dalam kemasan",
      image: "💧",
    },
    {
      id: 3,
      name: "Teh Botol Sosro",
      category: "Minuman",
      price: 4500,
      stock: 5,
      minStock: 30,
      barcode: "8992761123456",
      description: "Teh dalam botol rasa original",
      image: "🍵",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    minStock: "",
    barcode: "",
    description: "",
    image: "",
  })

  const categories = ["all", ...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm)
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)

  const handleSubmit = () => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...editingProduct,
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                minStock: Number(formData.minStock),
              }
            : p,
        ),
      )
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        minStock: Number(formData.minStock),
      }
      setProducts([...products, newProduct])
    }

    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      minStock: "",
      barcode: "",
      description: "",
      image: "",
    })
    setEditingProduct(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      barcode: product.barcode,
      description: product.description,
      image: product.image,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Makanan">Makanan</SelectItem>
                    <SelectItem value="Minuman">Minuman</SelectItem>
                    <SelectItem value="Snack">Snack</SelectItem>
                    <SelectItem value="Perawatan">Perawatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Harga</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stok</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="minStock">Stok Minimum</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image">Emoji/Icon</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="🍜"
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingProduct ? "Update Produk" : "Tambah Produk"}
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
            placeholder="Cari produk atau barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "Semua Kategori" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{product.image}</div>
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                {product.stock <= product.minStock && <AlertCircle className="w-5 h-5 text-orange-500" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Harga:</span>
                <span className="font-bold text-green-600">{formatCurrency(product.price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stok:</span>
                <Badge variant={product.stock <= product.minStock ? "destructive" : "default"}>
                  {product.stock} pcs
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Barcode:</span>
                <span className="text-sm font-mono">{product.barcode}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Tidak ada produk yang ditemukan</p>
        </div>
      )}
    </div>
  )
}

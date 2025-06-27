"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

interface SettingsPreviewProps {
  settings: any
}

export function SettingsPreview({ settings }: SettingsPreviewProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(value)

  const formatDate = (date: Date) => {
    const formats = {
      "DD/MM/YYYY": "id-ID",
      "MM/DD/YYYY": "en-US",
      "YYYY-MM-DD": "sv-SE",
    }
    return date.toLocaleDateString(formats[settings.dateFormat as keyof typeof formats])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour12: settings.timeFormat === "12h",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Preview Pengaturan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Store Info Preview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Info Toko</h4>
          <p className="font-bold">{settings.storeName}</p>
          <p className="text-sm text-gray-600">{settings.storeAddress}</p>
          <p className="text-sm text-gray-600">{settings.storePhone}</p>
          <p className="text-sm text-gray-600">{settings.storeEmail}</p>
        </div>

        {/* Receipt Preview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Preview Struk</h4>
          <div className="bg-white p-3 border rounded text-xs font-mono">
            <div className="text-center border-b pb-2 mb-2">
              {settings.showLogo && <div className="text-lg">🏪</div>}
              <div className="font-bold">{settings.storeName}</div>
              <div>{settings.storeAddress}</div>
              <div>{settings.storePhone}</div>
            </div>
            <div className="text-center mb-2">{settings.receiptHeader}</div>
            <div className="border-b pb-2 mb-2">
              <div className="flex justify-between">
                <span>Contoh Produk</span>
                <span>{formatCurrency(15000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pajak ({settings.taxRate}%)</span>
                <span>{formatCurrency(1500)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(16500)}</span>
              </div>
            </div>
            <div className="text-center text-xs">{settings.receiptFooter}</div>
          </div>
        </div>

        {/* System Preview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Format Sistem</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Mata Uang:</span>
              <Badge>{settings.currency}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Format Tanggal:</span>
              <span>{formatDate(new Date())}</span>
            </div>
            <div className="flex justify-between">
              <span>Format Waktu:</span>
              <span>{formatTime(new Date())}</span>
            </div>
            <div className="flex justify-between">
              <span>Bahasa:</span>
              <Badge>{settings.language === "id" ? "Indonesia" : "English"}</Badge>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Notifikasi</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Alert Stok Menipis:</span>
              <Badge variant={settings.lowStockAlert ? "default" : "secondary"}>
                {settings.lowStockAlert ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
            {settings.lowStockAlert && (
              <div className="flex justify-between">
                <span>Batas Minimum:</span>
                <span>{settings.lowStockThreshold} item</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Email Laporan Harian:</span>
              <Badge variant={settings.dailyReportEmail ? "default" : "secondary"}>
                {settings.dailyReportEmail ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

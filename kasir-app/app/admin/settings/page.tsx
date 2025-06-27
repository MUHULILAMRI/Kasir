"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsPreview } from "@/components/settings-preview"
import { AuditLog } from "@/components/audit-log"
import { useAuditLog } from "@/hooks/use-audit-log"
import {
  Settings,
  Store,
  Receipt,
  Bell,
  Shield,
  Database,
  Printer,
  Save,
  RotateCcw,
  Download,
  Upload,
  History,
} from "lucide-react"
import { useToast } from "@/components/toast-notification"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "AlfaPOS Store",
    storeAddress: "Jl. Raya No. 123, Jakarta",
    storePhone: "021-12345678",
    storeEmail: "store@alfapos.com",

    // Receipt Settings
    receiptHeader: "Terima kasih telah berbelanja",
    receiptFooter: "Barang yang sudah dibeli tidak dapat dikembalikan",
    showLogo: true,
    printReceipt: true,

    // Tax Settings
    taxRate: 10,
    taxIncluded: false,

    // Notification Settings
    lowStockAlert: true,
    lowStockThreshold: 10,
    dailyReportEmail: true,

    // Security Settings
    sessionTimeout: 30,
    requirePasswordChange: false,

    // System Settings
    currency: "IDR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    language: "id",

    // Printer Settings
    printerName: "EPSON TM-T82",
    paperSize: "80mm",
    printCopies: 1,
  })

  const [originalSettings, setOriginalSettings] = useState(settings)
  const { showToast, ToastContainer } = useToast()
  const { logs, logSettingChange, logBulkChange, exportLogs } = useAuditLog()

  useEffect(() => {
    const savedSettings = localStorage.getItem("alfapos_settings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      setOriginalSettings(parsed)
    }
  }, [])

  const handleSave = () => {
    try {
      // Compare settings to log changes
      const changes: Array<{ field: string; oldValue: any; newValue: any }> = []

      Object.keys(settings).forEach((key) => {
        const oldValue = originalSettings[key as keyof typeof originalSettings]
        const newValue = settings[key as keyof typeof settings]

        if (oldValue !== newValue) {
          changes.push({
            field: key,
            oldValue,
            newValue,
          })
        }
      })

      if (changes.length > 0) {
        // Log all changes
        changes.forEach((change) => {
          const category = getCategoryForField(change.field)
          logSettingChange(category, change.field, change.oldValue, change.newValue)
        })
      }

      localStorage.setItem("alfapos_settings", JSON.stringify(settings))
      setOriginalSettings(settings)
      showToast(`Pengaturan berhasil disimpan! ${changes.length} perubahan dicatat.`, "success")
    } catch (error) {
      showToast("Gagal menyimpan pengaturan. Silakan coba lagi.", "error")
    }
  }

  const handleReset = () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan pengaturan ke default?")) {
      const defaultSettings = {
        // Store Settings
        storeName: "AlfaPOS Store",
        storeAddress: "Jl. Raya No. 123, Jakarta",
        storePhone: "021-12345678",
        storeEmail: "store@alfapos.com",

        // Receipt Settings
        receiptHeader: "Terima kasih telah berbelanja",
        receiptFooter: "Barang yang sudah dibeli tidak dapat dikembalikan",
        showLogo: true,
        printReceipt: true,

        // Tax Settings
        taxRate: 10,
        taxIncluded: false,

        // Notification Settings
        lowStockAlert: true,
        lowStockThreshold: 10,
        dailyReportEmail: true,

        // Security Settings
        sessionTimeout: 30,
        requirePasswordChange: false,

        // System Settings
        currency: "IDR",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        language: "id",

        // Printer Settings
        printerName: "EPSON TM-T82",
        paperSize: "80mm",
        printCopies: 1,
      }

      // Log reset action for all changed fields
      Object.keys(settings).forEach((key) => {
        const currentValue = settings[key as keyof typeof settings]
        const defaultValue = defaultSettings[key as keyof typeof defaultSettings]

        if (currentValue !== defaultValue) {
          const category = getCategoryForField(key)
          logSettingChange(category, key, currentValue, defaultValue, "RESET")
        }
      })

      setSettings(defaultSettings)
      setOriginalSettings(defaultSettings)
      localStorage.setItem("alfapos_settings", JSON.stringify(defaultSettings))
      showToast("Pengaturan berhasil direset ke default!", "success")
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `alfapos-settings-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    // Log export action
    logSettingChange("System", "settings_export", null, "exported", "EXPORT")
    showToast("Pengaturan berhasil diekspor!", "success")
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)

          // Log import action for all fields
          Object.keys(importedSettings).forEach((key) => {
            const oldValue = settings[key as keyof typeof settings]
            const newValue = importedSettings[key]

            if (oldValue !== newValue) {
              const category = getCategoryForField(key)
              logSettingChange(category, key, oldValue, newValue, "IMPORT")
            }
          })

          setSettings(importedSettings)
          localStorage.setItem("alfapos_settings", JSON.stringify(importedSettings))
          showToast("Pengaturan berhasil diimpor!", "success")
        } catch (error) {
          showToast("File tidak valid. Silakan pilih file pengaturan yang benar.", "error")
        }
      }
      reader.readAsText(file)
    }
  }

  const getCategoryForField = (field: string): string => {
    if (["storeName", "storeAddress", "storePhone", "storeEmail"].includes(field)) {
      return "Store Information"
    }
    if (["receiptHeader", "receiptFooter", "showLogo", "printReceipt"].includes(field)) {
      return "Receipt Settings"
    }
    if (["taxRate", "taxIncluded"].includes(field)) {
      return "Tax Settings"
    }
    if (["lowStockAlert", "lowStockThreshold", "dailyReportEmail"].includes(field)) {
      return "Notification Settings"
    }
    if (["sessionTimeout", "requirePasswordChange"].includes(field)) {
      return "Security Settings"
    }
    if (["currency", "dateFormat", "timeFormat", "language"].includes(field)) {
      return "System Settings"
    }
    if (["printerName", "paperSize", "printCopies"].includes(field)) {
      return "Printer Settings"
    }
    return "General"
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
        <div className="flex items-center space-x-3">
          <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-settings" />
          <Button variant="outline" onClick={() => document.getElementById("import-settings")?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleReset} variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Simpan Pengaturan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Receipt className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center">
            <History className="w-4 h-4 mr-2" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Store Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="w-5 h-5 mr-2" />
                  Informasi Toko
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="storeName">Nama Toko</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => updateSetting("storeName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="storeAddress">Alamat</Label>
                  <Textarea
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => updateSetting("storeAddress", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="storePhone">Telepon</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => updateSetting("storePhone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => updateSetting("storeEmail", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Receipt Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Pengaturan Struk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="receiptHeader">Header Struk</Label>
                  <Input
                    id="receiptHeader"
                    value={settings.receiptHeader}
                    onChange={(e) => updateSetting("receiptHeader", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="receiptFooter">Footer Struk</Label>
                  <Input
                    id="receiptFooter"
                    value={settings.receiptFooter}
                    onChange={(e) => updateSetting("receiptFooter", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showLogo">Tampilkan Logo</Label>
                  <Switch
                    id="showLogo"
                    checked={settings.showLogo}
                    onCheckedChange={(checked) => updateSetting("showLogo", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="printReceipt">Auto Print Struk</Label>
                  <Switch
                    id="printReceipt"
                    checked={settings.printReceipt}
                    onCheckedChange={(checked) => updateSetting("printReceipt", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tax Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Pengaturan Pajak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="taxRate">Tarif Pajak (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => updateSetting("taxRate", Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="taxIncluded">Pajak Sudah Termasuk</Label>
                  <Switch
                    id="taxIncluded"
                    checked={settings.taxIncluded}
                    onCheckedChange={(checked) => updateSetting("taxIncluded", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowStockAlert">Alert Stok Menipis</Label>
                  <Switch
                    id="lowStockAlert"
                    checked={settings.lowStockAlert}
                    onCheckedChange={(checked) => updateSetting("lowStockAlert", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="lowStockThreshold">Batas Stok Minimum</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => updateSetting("lowStockThreshold", Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dailyReportEmail">Email Laporan Harian</Label>
                  <Switch
                    id="dailyReportEmail"
                    checked={settings.dailyReportEmail}
                    onCheckedChange={(checked) => updateSetting("dailyReportEmail", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sessionTimeout">Timeout Sesi (menit)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting("sessionTimeout", Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requirePasswordChange">Wajib Ganti Password</Label>
                  <Switch
                    id="requirePasswordChange"
                    checked={settings.requirePasswordChange}
                    onCheckedChange={(checked) => updateSetting("requirePasswordChange", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Sistem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currency">Mata Uang</Label>
                  <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Format Tanggal</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => updateSetting("dateFormat", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeFormat">Format Waktu</Label>
                  <Select value={settings.timeFormat} onValueChange={(value) => updateSetting("timeFormat", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 Jam</SelectItem>
                      <SelectItem value="12h">12 Jam (AM/PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Bahasa</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Printer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Printer className="w-5 h-5 mr-2" />
                Pengaturan Printer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="printerName">Nama Printer</Label>
                  <Input
                    id="printerName"
                    value={settings.printerName}
                    onChange={(e) => updateSetting("printerName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="paperSize">Ukuran Kertas</Label>
                  <Select value={settings.paperSize} onValueChange={(value) => updateSetting("paperSize", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58mm">58mm</SelectItem>
                      <SelectItem value="80mm">80mm</SelectItem>
                      <SelectItem value="A4">A4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="printCopies">Jumlah Salinan</Label>
                  <Input
                    id="printCopies"
                    type="number"
                    min="1"
                    max="5"
                    value={settings.printCopies}
                    onChange={(e) => updateSetting("printCopies", Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <SettingsPreview settings={settings} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog logs={logs} onExport={() => exportLogs("json")} />
        </TabsContent>
      </Tabs>

      <ToastContainer />
    </div>
  )
}

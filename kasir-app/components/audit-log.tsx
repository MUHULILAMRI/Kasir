"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Search, Download, User, Clock, ChevronDown, ChevronRight } from "lucide-react"

interface AuditLogEntry {
  id: string
  timestamp: string
  userId: number
  userName: string
  action: "CREATE" | "UPDATE" | "DELETE" | "RESET" | "IMPORT" | "EXPORT"
  category: string
  field: string
  oldValue: any
  newValue: any
  description: string
  ipAddress?: string
  userAgent?: string
}

interface AuditLogProps {
  logs: AuditLogEntry[]
  onExport?: () => void
}

export function AuditLog({ logs, onExport }: AuditLogProps) {
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(logs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

  useEffect(() => {
    let filtered = logs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by action
    if (selectedAction !== "all") {
      filtered = filtered.filter((log) => log.action === selectedAction)
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((log) => log.category === selectedCategory)
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
      }

      filtered = filtered.filter((log) => new Date(log.timestamp) >= filterDate)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, selectedAction, selectedCategory, dateRange])

  const toggleExpanded = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800"
      case "UPDATE":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      case "RESET":
        return "bg-orange-100 text-orange-800"
      case "IMPORT":
        return "bg-purple-100 text-purple-800"
      case "EXPORT":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatValue = (value: any) => {
    if (typeof value === "boolean") {
      return value ? "Aktif" : "Nonaktif"
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  const categories = ["all", ...new Set(logs.map((log) => log.category))]
  const actions = ["all", "CREATE", "UPDATE", "DELETE", "RESET", "IMPORT", "EXPORT"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Audit Log Pengaturan
          </div>
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Log
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari user, field, atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Aksi" />
            </SelectTrigger>
            <SelectContent>
              {actions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action === "all" ? "Semua Aksi" : action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "Semua Kategori" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Waktu</SelectItem>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="week">7 Hari Terakhir</SelectItem>
              <SelectItem value="month">30 Hari Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Log Entries */}
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada log yang ditemukan</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                        <span className="text-sm font-medium">{log.category}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{log.field}</span>
                      </div>

                      <p className="text-sm text-gray-800 mb-2">{log.description}</p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {log.userName}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => toggleExpanded(log.id)} className="ml-2">
                      {expandedLogs.has(log.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {expandedLogs.has(log.id) && (
                    <div className="mt-4 pt-4 border-t bg-gray-50 rounded p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {log.oldValue !== undefined && (
                          <div>
                            <label className="font-medium text-gray-700">Nilai Lama:</label>
                            <pre className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-xs overflow-x-auto">
                              {formatValue(log.oldValue)}
                            </pre>
                          </div>
                        )}

                        {log.newValue !== undefined && (
                          <div>
                            <label className="font-medium text-gray-700">Nilai Baru:</label>
                            <pre className="mt-1 p-2 bg-green-50 border border-green-200 rounded text-xs overflow-x-auto">
                              {formatValue(log.newValue)}
                            </pre>
                          </div>
                        )}
                      </div>

                      {(log.ipAddress || log.userAgent) && (
                        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                          {log.ipAddress && <div>IP Address: {log.ipAddress}</div>}
                          {log.userAgent && <div>User Agent: {log.userAgent}</div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total: {filteredLogs.length} log entries</span>
            <span>
              Menampilkan {Math.min(filteredLogs.length, 50)} dari {logs.length} total
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

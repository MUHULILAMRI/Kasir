"use client"

import { useState, useEffect } from "react"

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

export function useAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])

  useEffect(() => {
    const savedLogs = localStorage.getItem("alfapos_audit_logs")
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs))
    }
  }, [])

  const addLog = (logData: Omit<AuditLogEntry, "id" | "timestamp" | "ipAddress" | "userAgent">) => {
    const currentUser = JSON.parse(localStorage.getItem("alfapos_current_user") || "{}")

    const newLog: AuditLogEntry = {
      ...logData,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id || 0,
      userName: currentUser.name || "System",
      ipAddress: "127.0.0.1", // In real app, get from server
      userAgent: navigator.userAgent,
    }

    const updatedLogs = [newLog, ...logs].slice(0, 1000) // Keep only last 1000 logs
    setLogs(updatedLogs)
    localStorage.setItem("alfapos_audit_logs", JSON.stringify(updatedLogs))
  }

  const logSettingChange = (
    category: string,
    field: string,
    oldValue: any,
    newValue: any,
    action: "CREATE" | "UPDATE" | "DELETE" | "RESET" | "IMPORT" | "EXPORT" = "UPDATE",
  ) => {
    let description = ""

    switch (action) {
      case "CREATE":
        description = `Membuat pengaturan ${field} dengan nilai: ${newValue}`
        break
      case "UPDATE":
        description = `Mengubah ${field} dari "${oldValue}" menjadi "${newValue}"`
        break
      case "DELETE":
        description = `Menghapus pengaturan ${field} dengan nilai: ${oldValue}`
        break
      case "RESET":
        description = `Reset pengaturan ${field} ke nilai default`
        break
      case "IMPORT":
        description = `Import pengaturan ${field}`
        break
      case "EXPORT":
        description = `Export pengaturan ${field}`
        break
    }

    addLog({
      action,
      category,
      field,
      oldValue,
      newValue,
      description,
    })
  }

  const logBulkChange = (category: string, changes: Array<{ field: string; oldValue: any; newValue: any }>) => {
    changes.forEach((change) => {
      logSettingChange(category, change.field, change.oldValue, change.newValue)
    })
  }

  const exportLogs = (format: "json" | "csv" = "json") => {
    if (format === "json") {
      const dataStr = JSON.stringify(logs, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `alfapos-audit-log-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } else if (format === "csv") {
      const headers = ["Timestamp", "User", "Action", "Category", "Field", "Old Value", "New Value", "Description"]
      const csvContent = [
        headers.join(","),
        ...logs.map((log) =>
          [
            log.timestamp,
            log.userName,
            log.action,
            log.category,
            log.field,
            JSON.stringify(log.oldValue),
            JSON.stringify(log.newValue),
            log.description,
          ]
            .map((field) => `"${field}"`)
            .join(","),
        ),
      ].join("\n")

      const dataBlob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `alfapos-audit-log-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const clearLogs = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua log audit? Tindakan ini tidak dapat dibatalkan.")) {
      setLogs([])
      localStorage.removeItem("alfapos_audit_logs")

      // Log the clearing action
      addLog({
        action: "DELETE",
        category: "System",
        field: "audit_logs",
        oldValue: `${logs.length} entries`,
        newValue: "0 entries",
        description: "Menghapus semua log audit",
      })
    }
  }

  return {
    logs,
    addLog,
    logSettingChange,
    logBulkChange,
    exportLogs,
    clearLogs,
  }
}

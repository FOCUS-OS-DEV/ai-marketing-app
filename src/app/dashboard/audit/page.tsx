'use client'

import { Card } from '@/components/ui'
import { useAuditLog } from '@/hooks/useSupabaseData'

export default function AuditPage() {
  const { logs, loading } = useAuditLog(100)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'INSERT':
        return { label: 'יצירה', color: 'bg-green-100 text-green-700' }
      case 'UPDATE':
        return { label: 'עדכון', color: 'bg-blue-100 text-blue-700' }
      case 'DELETE':
        return { label: 'מחיקה', color: 'bg-red-100 text-red-700' }
      default:
        return { label: action, color: 'bg-gray-100 text-gray-700' }
    }
  }

  const getTableLabel = (tableName: string) => {
    const labels: Record<string, string> = {
      beginners_config: 'הגדרות מתחילים',
      beginners_modules: 'מודולים מתחילים',
      beginners_tasks: 'משימות מתחילים',
      beginners_content: 'תוכן מתחילים',
      pro_config: 'הגדרות Pro',
      pro_modules: 'מודולים Pro',
      pro_tasks: 'משימות Pro',
      pro_audiences: 'קהלי יעד Pro',
      pro_content: 'תוכן Pro',
    }
    return labels[tableName] || tableName
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">לוג שינויים</h1>
        <p className="text-gray-600 mt-1">צפה בכל השינויים שנעשו במערכת</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{logs.length}</p>
            <p className="text-sm text-gray-500">סה"כ שינויים</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {logs.filter(l => l.action === 'INSERT').length}
            </p>
            <p className="text-sm text-gray-500">יצירות</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {logs.filter(l => l.action === 'UPDATE').length}
            </p>
            <p className="text-sm text-gray-500">עדכונים</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {logs.filter(l => l.action === 'DELETE').length}
            </p>
            <p className="text-sm text-gray-500">מחיקות</p>
          </div>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">תאריך</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">משתמש</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">פעולה</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">טבלה</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const { label, color } = getActionLabel(log.action)
                return (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {log.user_email || 'לא ידוע'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${color}`}>
                        {label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {getTableLabel(log.table_name)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {logs.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-gray-500">אין שינויים עדיין</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

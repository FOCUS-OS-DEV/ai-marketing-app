'use client'

import { useState } from 'react'
import { Button, useToast } from '@/components/ui'

export default function SettingsPage() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState({
    companyName: 'AI Marketing Bootcamp',
    vatRate: 17,
    defaultCurrency: 'ILS',
    emailNotifications: true,
    autoSave: true,
  })

  const handleSave = () => {
    // TODO: Save to Supabase
    showToast('ההגדרות נשמרו בהצלחה', 'success')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">הגדרות</h1>
        <p className="text-gray-600 mt-1">נהל את הגדרות המערכת</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">הגדרות כלליות</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם החברה</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">אחוז מע״מ</label>
              <input
                type="number"
                value={settings.vatRate}
                onChange={(e) => setSettings({ ...settings, vatRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מטבע ברירת מחדל</label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ILS">₪ שקל</option>
                <option value="USD">$ דולר</option>
                <option value="EUR">€ אירו</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">התראות</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700">התראות אימייל</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.emailNotifications ? 'right-0.5' : 'right-5'}`} />
              </div>
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700">שמירה אוטומטית</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${settings.autoSave ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.autoSave ? 'right-0.5' : 'right-5'}`} />
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          שמור הגדרות
        </Button>
      </div>
    </div>
  )
}

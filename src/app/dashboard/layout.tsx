'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { ToastProvider } from '@/components/ui/Toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f5f7fa]" dir="rtl">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div
          className={`min-h-screen transition-all duration-300 ${
            sidebarOpen ? 'mr-64' : 'mr-16'
          }`}
        >
          <Header />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}

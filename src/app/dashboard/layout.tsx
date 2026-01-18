import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { ToastProvider } from '@/components/ui/Toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="mr-64">
          <Header />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}

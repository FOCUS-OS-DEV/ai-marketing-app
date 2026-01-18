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
      <div className="min-h-screen bg-[#f5f7fa]" dir="rtl">
        <Sidebar />
        <div className="mr-64 ml-0 min-h-screen overflow-x-hidden">
          <Header />
          <main className="p-6 w-full">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}

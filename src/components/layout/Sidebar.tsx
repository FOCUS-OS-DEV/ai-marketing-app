'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  children?: { name: string; href: string }[]
}

const navigation: NavItem[] = [
  {
    name: 'לוח בקרה',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'תוכנית למתחילים',
    href: '/dashboard/beginners',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    children: [
      { name: 'סקירה כללית', href: '/dashboard/beginners?tab=overview' },
      { name: 'מודולים', href: '/dashboard/beginners?tab=modules' },
      { name: 'משימות', href: '/dashboard/beginners?tab=tasks' },
      { name: 'סקר מתחרים', href: '/dashboard/beginners?tab=competitors' },
      { name: 'מחשבון רווחיות', href: '/dashboard/beginners?tab=calculator' },
    ],
  },
  {
    name: 'תוכנית Pro',
    href: '/dashboard/pro',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    children: [
      { name: 'סקירה כללית', href: '/dashboard/pro?tab=overview' },
      { name: 'מודולים', href: '/dashboard/pro?tab=modules' },
      { name: 'משימות', href: '/dashboard/pro?tab=tasks' },
      { name: 'מחשבון רווחיות', href: '/dashboard/pro?tab=calculator' },
    ],
  },
  {
    name: 'לוג שינויים',
    href: '/dashboard/audit',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'הגדרות',
    href: '/dashboard/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Auto-expand current section
  useEffect(() => {
    navigation.forEach(item => {
      if (item.children && pathname.startsWith(item.href)) {
        setExpandedItems(prev => new Set(prev).add(item.href))
      }
    })
  }, [pathname])

  const toggleExpand = (href: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(href)) {
        newSet.delete(href)
      } else {
        newSet.add(href)
      }
      return newSet
    })
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen bg-white border-l border-gray-200 flex flex-col z-50 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">AI Bootcamp</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isOpen ? 'סגור תפריט' : 'פתח תפריט'}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const isExpanded = expandedItems.has(item.href)
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.name}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title={!isOpen ? item.name : undefined}
                  >
                    {item.icon}
                    {isOpen && <span className="font-medium text-sm">{item.name}</span>}
                  </Link>
                  {isOpen && hasChildren && (
                    <button
                      onClick={() => toggleExpand(item.href)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Children */}
                {isOpen && hasChildren && isExpanded && (
                  <div className="mt-1 mr-4 space-y-1">
                    {item.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname + (typeof window !== 'undefined' ? window.location.search : '') === child.href
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-3 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
              <p className="text-sm font-medium">צריך עזרה?</p>
              <p className="text-xs opacity-80 mt-1">צור קשר עם התמיכה</p>
            </div>
          </div>
        )}

        {/* Collapsed footer */}
        {!isOpen && (
          <div className="p-2 border-t border-gray-200">
            <button className="w-full p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white" title="עזרה">
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

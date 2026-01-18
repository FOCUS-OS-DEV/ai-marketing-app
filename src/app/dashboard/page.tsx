'use client'

import Link from 'next/link'

const programs = [
  {
    title: 'תוכנית למתחילים',
    description: 'לאנשים שרוצים להיכנס לעולם השיווק הדיגיטלי עם AI',
    href: '/dashboard/beginners',
    color: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'תוכנית Pro',
    description: 'למשווקים מנוסים שרוצים לשדרג עם כלי AI מתקדמים',
    href: '/dashboard/pro',
    color: 'from-purple-500 to-pink-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

const stats = [
  { label: 'סה"כ מודולים', value: '12', icon: '📚' },
  { label: 'משימות פעילות', value: '8', icon: '✅' },
  { label: 'קהלי יעד', value: '5', icon: '👥' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">שלום! 👋</h1>
        <p className="text-gray-600 mt-1">ברוך הבא למערכת ניהול AI Marketing Bootcamp</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Programs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">תוכניות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <Link
              key={program.title}
              href={program.href}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {program.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{program.title}</h3>
              <p className="text-gray-600">{program.description}</p>
              <div className="mt-4 flex items-center text-blue-600 font-medium">
                <span>צפה בפרטים</span>
                <svg className="w-4 h-4 mr-2 group-hover:translate-x-[-4px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">פעולות מהירות</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/beginners"
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
          >
            ערוך תוכנית למתחילים
          </Link>
          <Link
            href="/dashboard/pro"
            className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium"
          >
            ערוך תוכנית Pro
          </Link>
          <Link
            href="/dashboard/audit"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            צפה בלוג שינויים
          </Link>
        </div>
      </div>
    </div>
  )
}

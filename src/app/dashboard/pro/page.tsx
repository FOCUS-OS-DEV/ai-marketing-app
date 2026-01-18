'use client'

import { useState } from 'react'
import { Button, useToast } from '@/components/ui'
import { useProModules, useProTasks, useProAudiences, useProContent } from '@/hooks/useSupabaseData'

interface Topic {
  id: number
  name: string
  hours: number
  desc?: string
}

interface Module {
  id: number
  name: string
  color: string
  hours: number
  expanded: boolean
  order: number
  topics: Topic[]
}

interface Task {
  id: number
  text: string
  done: boolean
  category: string
  owner: string
}

interface Audience {
  id: number
  title: string
  desc: string
}

interface CalcSection {
  id: string
  title: string
  badge: string
  badgeText: string
  multiplier: string | null
  isRevenue?: boolean
  isParams?: boolean
  items: CalcItem[]
}

interface CalcItem {
  id: string
  label: string
  value: number
  unit: string
  hasVat?: boolean
  isParam?: boolean
  tooltip?: string
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  'תוכן והוראה': { bg: '#fce7f3', border: '#ec4899', text: '#be185d' },
  'מיקום והפקה': { bg: '#f3e8ff', border: '#a855f7', text: '#7c3aed' },
  'מכירות': { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
  'מחקר': { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
}

const ownerColors: Record<string, string> = {
  'לא משויך': '#9ca3af',
  'אוניל': '#3b82f6',
  'שחר': '#8b5cf6',
  'ארד': '#f59e0b',
  'משותף': '#22c55e',
}

const owners = ['לא משויך', 'אוניל', 'שחר', 'ארד', 'משותף']
const categories = ['תוכן והוראה', 'מיקום והפקה', 'מכירות', 'מחקר']

const VAT_RATE = 0.18

const defaultCalcConfig: CalcSection[] = [
  {
    id: 'params',
    title: 'פרמטרים בסיסיים',
    badge: 'param',
    badgeText: 'בסיס',
    multiplier: null,
    isParams: true,
    items: [
      { id: 'students', label: 'סטודנטים במחזור', value: 35, unit: '₪', isParam: true },
      { id: 'sessions', label: 'מספר מפגשים', value: 24, unit: '₪', isParam: true },
      { id: 'price', label: 'מחיר לתלמיד (כולל מע"מ)', value: 17000, unit: '₪', isParam: true },
      { id: 'cancellationRate', label: 'ביטולים מלאים (%)', value: 4, unit: '%', isParam: true, tooltip: 'סטודנטים שמבטלים לגמרי ולא משלמים' }
    ]
  },
  {
    id: 'revenue',
    title: 'הכנסות נוספות',
    badge: 'revenue',
    badgeText: 'הכנסה',
    multiplier: null,
    isRevenue: true,
    items: [
      { id: 'extraMaterials', label: 'מכירת חומרי לימוד', value: 0, unit: '₪', hasVat: true, tooltip: 'הכנסה נוספת מעבר לשכר לימוד' }
    ]
  },
  {
    id: 'perStudent',
    title: 'הוצאות לפי תלמיד',
    badge: 'student',
    badgeText: '× סטודנטים',
    multiplier: 'students',
    items: [
      { id: 'gifts', label: 'מתנות פתיחה', value: 50, unit: '₪', hasVat: true },
      { id: 'certificates', label: 'תעודות וחומרים', value: 150, unit: '₪', hasVat: true },
      { id: 'cpl', label: 'עלות רכישת ליד (Meta)', value: 1500, unit: '₪', hasVat: false, tooltip: 'חברה זרה — ללא מע"מ' },
      { id: 'salesCommission', label: 'עמלת מכירות', value: 5, unit: '%', hasVat: false, tooltip: 'אחוז ממחיר נטו' }
    ]
  },
  {
    id: 'perSession',
    title: 'הוצאות לפי מפגש',
    badge: 'session',
    badgeText: '× מפגשים',
    multiplier: 'sessions',
    items: [
      { id: 'roomRent', label: 'שכירות כיתה', value: 600, unit: '₪', hasVat: true },
      { id: 'mainInstructor', label: 'מרצה ראשי', value: 800, unit: '₪', hasVat: false, tooltip: 'שכר עבודה — ללא מע"מ' },
      { id: 'assistant', label: 'מתרגל/עוזר הוראה', value: 300, unit: '₪', hasVat: false },
      { id: 'refreshments', label: 'כיבוד', value: 150, unit: '₪', hasVat: true },
      { id: 'techProduction', label: 'הפקה טכנית', value: 200, unit: '₪', hasVat: true }
    ]
  },
  {
    id: 'perCohort',
    title: 'הוצאות למחזור',
    badge: 'cohort',
    badgeText: 'קבוע למחזור',
    multiplier: null,
    items: [
      { id: 'marketingAgency', label: 'שיווק — קמפיינר/סוכנות', value: 5000, unit: '₪', hasVat: true },
      { id: 'marketingCreative', label: 'שיווק — קריאייטיב ותוכן', value: 3000, unit: '₪', hasVat: true },
      { id: 'landingPage', label: 'דף נחיתה/אתר', value: 1000, unit: '₪', hasVat: true },
      { id: 'materials', label: 'הכנת חומרי לימוד', value: 2000, unit: '₪', hasVat: true },
      { id: 'partialRefunds', label: 'זיכויים/החזרים חלקיים', value: 3000, unit: '₪', hasVat: false, tooltip: 'הנחות בדיעבד, החזרים חלקיים — לא ביטולים מלאים' }
    ]
  },
  {
    id: 'fixed',
    title: 'הוצאות קבועות (הקצאה)',
    badge: 'fixed',
    badgeText: '× חודשים',
    multiplier: 'months',
    items: [
      { id: 'cohortMonths', label: 'משך מחזור', value: 4, unit: '₪', isParam: true },
      { id: 'salaryManager', label: 'משכורת מנהל תוכנית', value: 8000, unit: '₪', hasVat: false },
      { id: 'software', label: 'תוכנות (LMS, CRM)', value: 1500, unit: '₪', hasVat: true },
      { id: 'overhead', label: 'הנהלה וכלליות', value: 2000, unit: '₪', hasVat: true }
    ]
  }
]

export default function ProPage() {
  const { showToast } = useToast()
  const { data: modules, setData: setModules, saving: savingModules, save: saveModules, loading: loadingModules } = useProModules()
  const { data: tasks, setData: setTasks, saving: savingTasks, save: saveTasks, loading: loadingTasks } = useProTasks()
  const { data: audiences, setData: setAudiences, saving: savingAudiences, save: saveAudiences, loading: loadingAudiences } = useProAudiences()
  const { content, setContent, saving: savingContent, save: saveContent, loading: loadingContent } = useProContent()

  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'tasks' | 'calculator'>('overview')
  const [calcConfig, setCalcConfig] = useState<CalcSection[]>(defaultCalcConfig)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [ownerFilter, setOwnerFilter] = useState<string>('all')

  const modulesList = modules as Module[]
  const tasksList = tasks as Task[]
  const audiencesList = audiences as Audience[]

  const isLoading = loadingModules || loadingTasks || loadingAudiences || loadingContent
  const isSaving = savingModules || savingTasks || savingAudiences || savingContent

  // Calculator helpers
  const getItemValue = (sectionId: string, itemId: string): number => {
    const section = calcConfig.find(s => s.id === sectionId)
    if (!section) return 0
    const item = section.items.find(i => i.id === itemId)
    return item ? item.value : 0
  }

  const setItemValue = (sectionId: string, itemId: string, value: number) => {
    setCalcConfig(calcConfig.map(section => {
      if (section.id !== sectionId) return section
      return {
        ...section,
        items: section.items.map(item =>
          item.id === itemId ? { ...item, value } : item
        )
      }
    }))
  }

  // Calculate totals
  const students = getItemValue('params', 'students')
  const sessions = getItemValue('params', 'sessions')
  const pricePerStudent = getItemValue('params', 'price')
  const cancellationRate = getItemValue('params', 'cancellationRate') / 100
  const cohortMonths = getItemValue('fixed', 'cohortMonths')

  const effectiveStudents = Math.round(students * (1 - cancellationRate))
  const grossRevenue = effectiveStudents * pricePerStudent
  const netRevenue = grossRevenue / (1 + VAT_RATE)
  const extraRevenue = getItemValue('revenue', 'extraMaterials')
  const totalRevenue = netRevenue + extraRevenue

  // Calculate expenses
  let totalExpenses = 0

  // Per student expenses
  const perStudentSection = calcConfig.find(s => s.id === 'perStudent')
  if (perStudentSection) {
    perStudentSection.items.forEach(item => {
      if (item.unit === '%') {
        totalExpenses += (netRevenue / students) * (item.value / 100) * effectiveStudents
      } else {
        totalExpenses += item.value * effectiveStudents
      }
    })
  }

  // Per session expenses
  const perSessionSection = calcConfig.find(s => s.id === 'perSession')
  if (perSessionSection) {
    perSessionSection.items.forEach(item => {
      totalExpenses += item.value * sessions
    })
  }

  // Per cohort expenses
  const perCohortSection = calcConfig.find(s => s.id === 'perCohort')
  if (perCohortSection) {
    perCohortSection.items.forEach(item => {
      totalExpenses += item.value
    })
  }

  // Fixed expenses
  const fixedSection = calcConfig.find(s => s.id === 'fixed')
  if (fixedSection) {
    fixedSection.items.forEach(item => {
      if (!item.isParam) {
        totalExpenses += item.value * cohortMonths
      }
    })
  }

  const profit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0
  const breakeven = totalExpenses > 0 && pricePerStudent > 0 ? Math.ceil(totalExpenses / (pricePerStudent / (1 + VAT_RATE))) : 0

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0
    }).format(num)
  }

  const handleSaveAll = async () => {
    try {
      await Promise.all([
        saveModules(modules),
        saveTasks(tasks),
        saveAudiences(audiences),
        saveContent(content),
      ])
      showToast('נשמר בהצלחה!', 'success')
    } catch {
      showToast('שגיאה בשמירה', 'error')
    }
  }

  const toggleModule = (id: number) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedModules(newExpanded)
  }

  // Module functions
  const addModule = () => {
    const maxId = modulesList.length > 0 ? Math.max(...modulesList.map(m => m.id)) : 0
    const newModule: Module = {
      id: maxId + 1,
      name: 'מודול Pro חדש',
      color: '#8b5cf6',
      hours: 4,
      expanded: false,
      order: modulesList.length + 1,
      topics: [],
    }
    setModules([...modulesList, newModule])
  }

  const updateModule = (id: number, updates: Partial<Module>) => {
    setModules(modulesList.map((m) => m.id === id ? { ...m, ...updates } : m))
  }

  const deleteModule = (id: number) => {
    setModules(modulesList.filter((m) => m.id !== id))
  }

  const addTopic = (moduleId: number) => {
    const module = modulesList.find(m => m.id === moduleId)
    if (!module) return

    const maxTopicId = module.topics.length > 0 ? Math.max(...module.topics.map(t => t.id)) : moduleId * 100
    const newTopic: Topic = {
      id: maxTopicId + 1,
      name: 'נושא חדש',
      hours: 1,
    }
    updateModule(moduleId, { topics: [...module.topics, newTopic] })
  }

  const updateTopic = (moduleId: number, topicId: number, updates: Partial<Topic>) => {
    const module = modulesList.find(m => m.id === moduleId)
    if (!module) return

    const newTopics = module.topics.map(t => t.id === topicId ? { ...t, ...updates } : t)
    updateModule(moduleId, { topics: newTopics })
  }

  const deleteTopic = (moduleId: number, topicId: number) => {
    const module = modulesList.find(m => m.id === moduleId)
    if (!module) return

    updateModule(moduleId, { topics: module.topics.filter(t => t.id !== topicId) })
  }

  // Task functions
  const addTask = () => {
    const maxId = tasksList.length > 0 ? Math.max(...tasksList.map(t => t.id)) : 0
    const newTask: Task = {
      id: maxId + 1,
      text: 'משימה חדשה',
      done: false,
      category: 'תוכן והוראה',
      owner: 'לא משויך',
    }
    setTasks([...tasksList, newTask])
  }

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(tasksList.map((t) => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTask = (id: number) => {
    setTasks(tasksList.filter((t) => t.id !== id))
  }

  // Audience functions
  const addAudience = () => {
    const maxId = audiencesList.length > 0 ? Math.max(...audiencesList.map(a => a.id)) : 0
    const newAudience: Audience = {
      id: maxId + 1,
      title: 'קהל יעד חדש',
      desc: '',
    }
    setAudiences([...audiencesList, newAudience])
  }

  const updateAudience = (id: number, updates: Partial<Audience>) => {
    setAudiences(audiencesList.map((a) => a.id === id ? { ...a, ...updates } : a))
  }

  const deleteAudience = (id: number) => {
    setAudiences(audiencesList.filter((a) => a.id !== id))
  }

  const totalHours = modulesList.reduce((sum, m) => sum + m.hours, 0)
  const completedTasks = tasksList.filter(t => t.done).length

  const filteredTasks = tasksList.filter(t => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    if (ownerFilter !== 'all' && t.owner !== ownerFilter) return false
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center py-8 px-6 bg-gradient-to-br from-purple-900 to-pink-800 rounded-2xl text-white">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">תוכנית Pro — שיווק דיגיטלי + AI</h1>
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
            PRO
          </span>
        </div>
        <p className="text-white/80">למשווקים מנוסים שרוצים לשדרג עם כלי AI מתקדמים</p>
        <div className="mt-4">
          <Button onClick={handleSaveAll} loading={isSaving}>
            💾 שמור שינויים
          </Button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-2 shadow-sm flex gap-2">
        {[
          { id: 'overview', label: 'סקירה כללית', icon: '📊' },
          { id: 'modules', label: `מודולים (${modulesList.length})`, icon: '📚' },
          { id: 'tasks', label: `משימות (${tasksList.length})`, icon: '✅' },
          { id: 'calculator', label: 'מחשבון רווחיות', icon: '🧮' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-br from-purple-900 to-pink-800 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="ml-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Stats Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gray-100">סטטיסטיקות</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{modulesList.length}</div>
                <div className="text-sm text-purple-700">מודולים</div>
              </div>
              <div className="bg-pink-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-pink-600">{totalHours}</div>
                <div className="text-sm text-pink-700">שעות</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{completedTasks}/{tasksList.length}</div>
                <div className="text-sm text-green-700">משימות הושלמו</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-indigo-600">{audiencesList.length}</div>
                <div className="text-sm text-indigo-700">קהלי יעד</div>
              </div>
            </div>
          </div>

          {/* Target Audiences Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">קהלי יעד</h2>
              <button
                onClick={addAudience}
                className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-600 transition-colors"
              >
                + הוסף
              </button>
            </div>
            <div className="space-y-3">
              {audiencesList.map((audience) => (
                <div
                  key={audience.id}
                  className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-r-4 border-purple-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={audience.title}
                      onChange={(e) => updateAudience(audience.id, { title: e.target.value })}
                      className="font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={() => deleteAudience(audience.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                  <textarea
                    value={audience.desc}
                    onChange={(e) => updateAudience(audience.id, { desc: e.target.value })}
                    className="w-full text-sm text-gray-600 bg-transparent resize-none focus:outline-none"
                    rows={2}
                    placeholder="תיאור קהל היעד..."
                  />
                </div>
              ))}
              {audiencesList.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  אין קהלי יעד מוגדרים
                </div>
              )}
            </div>
          </div>

          {/* Content Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gray-100">תוכן התוכנית</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">חזון התוכנית Pro</label>
                <textarea
                  value={content.vision || ''}
                  onChange={(e) => setContent({ ...content, vision: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={5}
                  placeholder="הכנס את חזון התוכנית..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modules Tab */}
      {activeTab === 'modules' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-purple-800">בונה מודולות סילבוס</h2>
              <p className="text-sm text-purple-600 mt-1">סה״כ: {modulesList.length} מודולים, {totalHours} שעות</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addModule}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                + מודולה חדשה
              </button>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                📤 ייצוא
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {modulesList.sort((a, b) => a.order - b.order).map((module, index) => (
              <div
                key={module.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                style={{ borderRight: `4px solid ${module.color}` }}
              >
                {/* Module Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 cursor-grab">⋮⋮</span>
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: module.color }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <input
                        type="text"
                        value={module.name}
                        onChange={(e) => {
                          e.stopPropagation()
                          updateModule(module.id, { name: e.target.value })
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none"
                      />
                      <div className="text-sm text-gray-500">
                        {module.topics.length} נושאים | {module.hours} שעות
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={module.color}
                      onChange={(e) => updateModule(module.id, { color: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="number"
                      value={module.hours}
                      onChange={(e) => updateModule(module.id, { hours: parseInt(e.target.value) || 0 })}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 px-3 py-1 border rounded-full text-center bg-gray-100"
                      min={0}
                    />
                    <span className="text-sm text-gray-500">שעות</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteModule(module.id)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedModules.has(module.id) ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Topics (Expanded) */}
                {expandedModules.has(module.id) && (
                  <div className="border-t bg-gray-50 p-4 space-y-2">
                    {module.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center gap-4 p-3 bg-white rounded-lg border"
                      >
                        <span className="text-gray-400 cursor-grab">⋮⋮</span>
                        <input
                          type="text"
                          value={topic.name}
                          onChange={(e) => updateTopic(module.id, topic.id, { name: e.target.value })}
                          className="flex-1 bg-transparent focus:outline-none"
                        />
                        <input
                          type="number"
                          value={topic.hours}
                          onChange={(e) => updateTopic(module.id, topic.id, { hours: parseFloat(e.target.value) || 0 })}
                          className="w-16 px-2 py-1 border rounded text-center"
                          min={0}
                          step={0.5}
                        />
                        <span className="text-sm text-gray-500">שעות</span>
                        <button
                          onClick={() => deleteTopic(module.id, topic.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addTopic(module.id)}
                      className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-400 hover:text-purple-500 transition-colors"
                    >
                      + הוסף נושא
                    </button>
                  </div>
                )}
              </div>
            ))}

            {modulesList.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                אין מודולים עדיין. לחץ על &quot;מודולה חדשה&quot; להתחיל.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">משימות לביצוע</h2>
            <div className="flex gap-2">
              <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                🔄 איפוס
              </button>
              <button
                onClick={addTask}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                + משימה
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">התקדמות</span>
              <span className="text-sm text-gray-500">{completedTasks}/{tasksList.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${tasksList.length > 0 ? (completedTasks / tasksList.length) * 100 : 0}%`,
                  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                }}
              >
                <span className="text-xs text-white font-medium px-2">
                  {tasksList.length > 0 ? Math.round((completedTasks / tasksList.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === 'all' ? 'bg-purple-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              הכל ({tasksList.length})
            </button>
            {categories.map((cat) => {
              const count = tasksList.filter(t => t.category === cat).length
              const doneCount = tasksList.filter(t => t.category === cat && t.done).length
              const colors = categoryColors[cat]
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: categoryFilter === cat ? colors.border : colors.bg,
                    color: categoryFilter === cat ? 'white' : colors.text,
                  }}
                >
                  {cat} ({doneCount}/{count})
                </button>
              )
            })}
          </div>

          {/* Owner Filters */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <span className="text-sm text-gray-500 ml-2">אחראי:</span>
            <button
              onClick={() => setOwnerFilter('all')}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                ownerFilter === 'all' ? 'bg-purple-900 text-white border-purple-900' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              הכל
            </button>
            {owners.map((owner) => {
              const count = tasksList.filter(t => t.owner === owner).length
              const color = ownerColors[owner]
              return (
                <button
                  key={owner}
                  onClick={() => setOwnerFilter(owner)}
                  className="px-3 py-1 rounded-full text-sm border transition-colors"
                  style={{
                    backgroundColor: ownerFilter === owner ? color : 'white',
                    color: ownerFilter === owner ? 'white' : color,
                    borderColor: ownerFilter === owner ? color : '#e5e7eb',
                  }}
                >
                  {owner} ({count})
                </button>
              )
            })}
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {filteredTasks.map((task) => {
              const colors = categoryColors[task.category] || categoryColors['תוכן והוראה']
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.bg }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={(e) => updateTask(task.id, { done: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) => updateTask(task.id, { text: e.target.value })}
                      className={`flex-1 bg-transparent border-none focus:outline-none ${task.done ? 'line-through text-gray-400' : ''}`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={task.category}
                      onChange={(e) => updateTask(task.id, { category: e.target.value })}
                      className="px-2 py-1 text-xs rounded border bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select
                      value={task.owner}
                      onChange={(e) => updateTask(task.id, { owner: e.target.value })}
                      className="px-2 py-1 text-xs rounded border bg-white"
                      style={{ color: ownerColors[task.owner] }}
                    >
                      {owners.map((owner) => (
                        <option key={owner} value={owner}>{owner}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}

            {filteredTasks.length === 0 && (
              <p className="text-center text-gray-500 py-8">אין משימות בקטגוריה זו</p>
            )}
          </div>
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">מחשבון רווחיות למחזור</h2>
            <div className="flex gap-2">
              <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                📤 ייצוא
              </button>
              <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                📥 ייבוא
              </button>
              <button
                onClick={() => setCalcConfig(defaultCalcConfig)}
                className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                🔄 איפוס
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl p-5 text-white text-center">
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <div className="text-sm text-white/80">הכנסה נטו</div>
              <div className="text-xs text-white/60 mt-1">(אחרי מע״מ)</div>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-5 text-white text-center">
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
              <div className="text-sm text-white/80">הוצאות</div>
            </div>
            <div className={`rounded-xl p-5 text-white text-center ${profit >= 0 ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-red-600 to-red-800'}`}>
              <div className="text-2xl font-bold">{formatCurrency(profit)}</div>
              <div className="text-sm text-white/80">רווח נקי</div>
              <div className="text-xs text-white/60 mt-1">{profitMargin.toFixed(1)}% מרווח</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-5 text-white text-center">
              <div className="text-2xl font-bold">{breakeven}</div>
              <div className="text-sm text-white/80">נקודת איזון</div>
              <div className="text-xs text-white/60 mt-1">סטודנטים</div>
            </div>
          </div>

          {/* Calculator Sections */}
          <div className="grid grid-cols-2 gap-4">
            {calcConfig.map((section) => (
              <div
                key={section.id}
                className={`rounded-xl p-4 border ${
                  section.isRevenue ? 'bg-green-50 border-green-200' :
                  section.isParams ? 'bg-blue-50 border-blue-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">{section.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    section.isRevenue ? 'bg-green-200 text-green-800' :
                    section.isParams ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {section.badgeText}
                  </span>
                </div>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={item.value}
                          onChange={(e) => setItemValue(section.id, item.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border rounded text-left bg-white"
                        />
                        <span className="text-gray-500 w-6">{item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-3">סיכום מחזור</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>סטודנטים (אחרי ביטולים):</span>
                <span className="font-medium">{effectiveStudents} מתוך {students}</span>
              </div>
              <div className="flex justify-between">
                <span>הכנסה ברוטו:</span>
                <span className="font-medium">{formatCurrency(grossRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>הכנסה נטו (אחרי מע״מ):</span>
                <span className="font-medium">{formatCurrency(netRevenue)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="font-semibold">רווח נקי:</span>
                <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

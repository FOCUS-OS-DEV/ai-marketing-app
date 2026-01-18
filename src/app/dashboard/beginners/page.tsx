'use client'

import { useState } from 'react'
import { Button, useToast } from '@/components/ui'
import { useBeginnersModules, useBeginnersTasks, useBeginnersContent, useBeginnersConfig } from '@/hooks/useSupabaseData'

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

interface Competitor {
  id: number
  name: string
  price: string
  hours: string
  duration: string
  format: string
  ai: string
  internship: string
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  'מחקר': { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
  'משפטי ופיננסי': { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
  'מכירות': { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
  'מיקום והפקה': { bg: '#f3e8ff', border: '#a855f7', text: '#7c3aed' },
  'תוכן והוראה': { bg: '#fce7f3', border: '#ec4899', text: '#be185d' },
  'החלטות': { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
}

const ownerColors: Record<string, string> = {
  'לא משויך': '#9ca3af',
  'אוניל': '#3b82f6',
  'שחר': '#8b5cf6',
  'ארד': '#f59e0b',
  'משותף': '#22c55e',
}

const owners = ['לא משויך', 'אוניל', 'שחר', 'ארד', 'משותף']
const categories = ['מחקר', 'משפטי ופיננסי', 'מכירות', 'מיקום והפקה', 'תוכן והוראה', 'החלטות']

const defaultCompetitors: Competitor[] = [
  { id: 1, name: 'SV College', price: '', hours: '64+120', duration: '~3 חודשים', format: 'פרונטלי', ai: 'ChatGPT, Jasper, Midjourney', internship: 'סטאז׳ 120 שעות' },
  { id: 2, name: 'HackerU', price: '', hours: '430-500', duration: '5.5-13 חודשים', format: 'פרונטלי', ai: 'כלי AI', internship: 'פרויקט 150 שעות' },
  { id: 3, name: 'Bar-Ilan', price: '', hours: '?', duration: '2x שבוע', format: 'פרונטלי', ai: 'AI מתקדם', internship: 'פרויקטי תיק' },
  { id: 4, name: 'Horizon Labs', price: '', hours: '320', duration: '2x שבוע', format: 'אונליין', ai: 'AI + 12 סדנאות', internship: 'לקוח תוך 90 יום' },
  { id: 5, name: 'NMC', price: '', hours: '310', duration: 'מפגשי ערב', format: 'פרונטלי', ai: 'כן', internship: 'פרויקטים עסקיים' },
  { id: 6, name: 'John Bryce', price: '', hours: '218-315', duration: '?', format: 'פרונטלי', ai: 'Canva, Meta', internship: 'לא ברור' },
  { id: 7, name: 'האו״פ חשיפה', price: '~5,400', hours: '120', duration: '3.5-4 חודשים', format: 'היברידי', ai: 'כן', internship: 'לא ברור' },
]

export default function BeginnersPage() {
  const { showToast } = useToast()
  const { data: modules, setData: setModules, saving: savingModules, save: saveModules, loading: loadingModules } = useBeginnersModules()
  const { data: tasks, setData: setTasks, saving: savingTasks, save: saveTasks, loading: loadingTasks } = useBeginnersTasks()
  const { content, setContent, saving: savingContent, save: saveContent, loading: loadingContent } = useBeginnersContent()
  const { data: config, setData: setConfig, saving: savingConfig, save: saveConfig, loading: loadingConfig } = useBeginnersConfig()

  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set())
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [ownerFilter, setOwnerFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'tasks' | 'competitors' | 'calculator'>('overview')
  const [competitors, setCompetitors] = useState<Competitor[]>(defaultCompetitors)
  const [editingCompetitor, setEditingCompetitor] = useState<number | null>(null)

  // Calculator state - matching HTML original exactly
  const [calc, setCalc] = useState({
    // Basic params
    students: 40,
    sessions: 30,
    price: 18000,
    cancellationRate: 5,
    // Additional revenue
    extraMaterials: 0,
    // Per student expenses
    gifts: 75,
    certificates: 200,
    cpl: 1000,
    salesCommission: 5,
    // Per session expenses
    roomRent: 500,
    mainInstructor: 500,
    assistant: 0,
    refreshments: 200,
    techProduction: 0,
    // Per cohort expenses
    marketingAgency: 0,
    marketingCreative: 0,
    landingPage: 0,
    materials: 1000,
    partialRefunds: 200,
    // Fixed expenses (per month)
    cohortMonths: 6,
    salaryManager: 0,
    software: 1500,
    overhead: 200,
  })

  const audiences = (config as { audiences?: Audience[] })?.audiences || []
  const modulesList = modules as Module[]
  const tasksList = tasks as Task[]

  const isLoading = loadingModules || loadingTasks || loadingContent || loadingConfig
  const isSaving = savingModules || savingTasks || savingContent || savingConfig

  const handleSaveAll = async () => {
    try {
      await Promise.all([
        saveModules(modules),
        saveTasks(tasks),
        saveContent(content),
        saveConfig(config),
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

  const addModule = () => {
    const maxId = modulesList.length > 0 ? Math.max(...modulesList.map(m => m.id)) : 0
    const newModule: Module = {
      id: maxId + 1,
      name: 'מודול חדש',
      color: '#3b82f6',
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

  const addTask = () => {
    const maxId = tasksList.length > 0 ? Math.max(...tasksList.map(t => t.id)) : 0
    const newTask: Task = {
      id: maxId + 1,
      text: 'משימה חדשה',
      done: false,
      category: 'מחקר',
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

  const addAudience = () => {
    const maxId = audiences.length > 0 ? Math.max(...audiences.map(a => a.id)) : 0
    const newAudience: Audience = {
      id: maxId + 1,
      title: 'קהל יעד חדש',
      desc: '',
    }
    setConfig({ ...config, audiences: [...audiences, newAudience] })
  }

  const updateAudience = (id: number, updates: Partial<Audience>) => {
    const newAudiences = audiences.map(a => a.id === id ? { ...a, ...updates } : a)
    setConfig({ ...config, audiences: newAudiences })
  }

  const deleteAudience = (id: number) => {
    setConfig({ ...config, audiences: audiences.filter(a => a.id !== id) })
  }

  const totalHours = modulesList.reduce((sum, m) => sum + m.hours, 0)

  const filteredTasks = tasksList.filter(t => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    if (ownerFilter !== 'all' && t.owner !== ownerFilter) return false
    return true
  })

  const completedTasks = tasksList.filter(t => t.done).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center py-8 px-6 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl text-white">
        <h1 className="text-2xl font-bold mb-2">תוכנית למתחילים — שיווק דיגיטלי + AI</h1>
        <p className="text-white/80">ניהול התוכנית לאנשים שרוצים להיכנס לעולם השיווק הדיגיטלי עם AI</p>
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
          { id: 'competitors', label: 'סקר מתחרים', icon: '🔍' },
          { id: 'calculator', label: 'מחשבון רווחיות', icon: '🧮' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white shadow-lg'
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
            <h2 className="text-lg font-bold text-[#1a1a2e] mb-4 pb-3 border-b-2 border-gray-100">סטטיסטיקות</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{modulesList.length}</div>
                <div className="text-sm text-blue-700">מודולים</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{totalHours}</div>
                <div className="text-sm text-purple-700">שעות</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{completedTasks}/{tasksList.length}</div>
                <div className="text-sm text-green-700">משימות הושלמו</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{audiences.length}</div>
                <div className="text-sm text-orange-700">קהלי יעד</div>
              </div>
            </div>
          </div>

          {/* Target Audiences Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-100">
              <h2 className="text-lg font-bold text-[#1a1a2e]">קהלי יעד</h2>
              <button
                onClick={addAudience}
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                + הוסף
              </button>
            </div>
            <div className="space-y-3">
              {audiences.map((audience) => (
                <div
                  key={audience.id}
                  className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border-r-4 border-blue-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={audience.title}
                      onChange={(e) => updateAudience(audience.id, { title: e.target.value })}
                      className="font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
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
              {audiences.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  אין קהלי יעד מוגדרים
                </div>
              )}
            </div>
          </div>

          {/* Content Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1a1a2e] mb-4 pb-3 border-b-2 border-gray-100">תוכן התוכנית</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">חזון התוכנית</label>
                <textarea
                  value={content.vision || ''}
                  onChange={(e) => setContent({ ...content, vision: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="הכנס את חזון התוכנית..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">דרישות קדם</label>
                <textarea
                  value={content.requirements || ''}
                  onChange={(e) => setContent({ ...content, requirements: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="הכנס את דרישות הקדם..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">יתרונות התוכנית</label>
                <textarea
                  value={content.advantages || ''}
                  onChange={(e) => setContent({ ...content, advantages: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="הכנס את יתרונות התוכנית..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modules Tab */}
      {activeTab === 'modules' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-green-800">בונה מודולות סילבוס</h2>
              <p className="text-sm text-green-600 mt-1">סה״כ: {modulesList.length} מודולים, {totalHours} שעות</p>
            </div>
            <button
              onClick={addModule}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + מודולה חדשה
            </button>
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
                        className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
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
                      className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-400 hover:text-green-500 transition-colors"
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
            <h2 className="text-xl font-bold text-[#1a1a2e]">משימות לביצוע</h2>
            <div className="flex gap-2">
              <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                🔄 איפוס
              </button>
              <button
                onClick={addTask}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
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
                categoryFilter === 'all' ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                ownerFilter === 'all' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-gray-700 border-gray-300'
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
              const colors = categoryColors[task.category] || categoryColors['מחקר']
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
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
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

      {/* Competitors Tab */}
      {activeTab === 'competitors' && (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300">
          <h2 className="text-xl font-bold text-purple-800 mb-6 pb-3 border-b-2 border-purple-300">
            סקר מתחרים — קורסי שיווק דיגיטלי פרונטליים בישראל
          </h2>

          {/* Competitor Table */}
          <div className="bg-white rounded-xl p-4 border border-purple-200 mb-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-purple-800 font-semibold">טבלת מתחרים</h3>
              <button
                onClick={() => {
                  const name = prompt('שם המתחרה:')
                  if (name) {
                    setCompetitors([...competitors, {
                      id: Date.now(),
                      name,
                      price: '',
                      hours: '?',
                      duration: '?',
                      format: 'פרונטלי',
                      ai: '?',
                      internship: '?',
                    }])
                  }
                }}
                className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                + מתחרה
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="p-2.5 text-right border-b-2 border-purple-300">מתחרה</th>
                    <th className="p-2.5 text-center border-b-2 border-purple-300">מחיר ₪</th>
                    <th className="p-2.5 text-center border-b-2 border-purple-300">שעות</th>
                    <th className="p-2.5 text-center border-b-2 border-purple-300">משך</th>
                    <th className="p-2.5 text-center border-b-2 border-purple-300">פורמט</th>
                    <th className="p-2.5 text-center border-b-2 border-purple-300">AI</th>
                    <th className="p-2.5 text-center border-b-2 border-purple-300">סטאז׳</th>
                    <th className="p-2.5 text-center border-b-2 border-purple-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c, idx) => (
                    <tr key={c.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-purple-50'}>
                      {editingCompetitor === c.id ? (
                        <>
                          <td className="p-2 border-b border-gray-200">
                            <input
                              type="text"
                              defaultValue={c.name}
                              onBlur={(e) => setCompetitors(competitors.map(comp => comp.id === c.id ? { ...comp, name: e.target.value } : comp))}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="p-2 border-b border-gray-200 text-center">
                            <input
                              type="text"
                              defaultValue={c.price}
                              onBlur={(e) => setCompetitors(competitors.map(comp => comp.id === c.id ? { ...comp, price: e.target.value } : comp))}
                              className="w-20 px-2 py-1 border rounded text-center"
                            />
                          </td>
                          <td className="p-2 border-b border-gray-200 text-center">
                            <input
                              type="text"
                              defaultValue={c.hours}
                              onBlur={(e) => setCompetitors(competitors.map(comp => comp.id === c.id ? { ...comp, hours: e.target.value } : comp))}
                              className="w-16 px-2 py-1 border rounded text-center"
                            />
                          </td>
                          <td className="p-2 border-b border-gray-200 text-center">
                            <input
                              type="text"
                              defaultValue={c.duration}
                              onBlur={(e) => setCompetitors(competitors.map(comp => comp.id === c.id ? { ...comp, duration: e.target.value } : comp))}
                              className="w-20 px-2 py-1 border rounded text-center"
                            />
                          </td>
                          <td className="p-2 border-b border-gray-200 text-center">
                            <select
                              defaultValue={c.format}
                              onChange={(e) => setCompetitors(competitors.map(comp => comp.id === c.id ? { ...comp, format: e.target.value } : comp))}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="פרונטלי">פרונטלי</option>
                              <option value="אונליין">אונליין</option>
                              <option value="היברידי">היברידי</option>
                            </select>
                          </td>
                          <td className="p-2 border-b border-gray-200 text-center text-xs">
                            <input
                              type="text"
                              defaultValue={c.ai}
                              onBlur={(e) => setCompetitors(competitors.map(comp => comp.id === c.id ? { ...comp, ai: e.target.value } : comp))}
                              className="w-full px-2 py-1 border rounded text-center text-xs"
                            />
                          </td>
                          <td className="p-2 border-b border-gray-200 text-center text-xs">
                            <input
                              type="text"
                              defaultValue={c.internship}
                              onBlur={(e) => setCompetitors(competitors.map(comp => comp.id === c.id ? { ...comp, internship: e.target.value } : comp))}
                              className="w-full px-2 py-1 border rounded text-center text-xs"
                            />
                          </td>
                          <td className="p-2 border-b border-gray-200 text-center">
                            <button onClick={() => setEditingCompetitor(null)} className="text-green-600 hover:text-green-800">✓</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 border-b border-gray-200 font-medium">{c.name}</td>
                          <td className="p-2 border-b border-gray-200 text-center">
                            {c.price || <span className="text-amber-500 cursor-pointer" onClick={() => setEditingCompetitor(c.id)}>⚠️ חסר</span>}
                          </td>
                          <td className="p-2 border-b border-gray-200 text-center">{c.hours}</td>
                          <td className="p-2 border-b border-gray-200 text-center">{c.duration}</td>
                          <td className="p-2 border-b border-gray-200 text-center">{c.format}</td>
                          <td className="p-2 border-b border-gray-200 text-center text-xs">{c.ai}</td>
                          <td className="p-2 border-b border-gray-200 text-center text-xs">{c.internship}</td>
                          <td className="p-2 border-b border-gray-200 text-center">
                            <button onClick={() => setEditingCompetitor(c.id)} className="hover:opacity-70 mr-1">✏️</button>
                            <button onClick={() => setCompetitors(competitors.filter(comp => comp.id !== c.id))} className="hover:opacity-70">🗑️</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Our Comparison */}
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300 mb-5">
            <h3 className="text-green-800 font-semibold mb-3">
              אנחנו (להשוואה) — <span className="font-normal text-sm">טרם הוחלט סופית</span>
            </h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><strong>מחיר:</strong> ₪17,000 (כולל מע״מ)</div>
              <div><strong>שעות:</strong> 120+ שעות לימוד</div>
              <div><strong>משך:</strong> ~4 חודשים</div>
              <div><strong>פורמט:</strong> היברידי — Zoom חי + הקלטות + מפגשים פרונטליים</div>
              <div><strong>AI:</strong> משולב בכל מודול + מודול Ethics ייעודי + הבנת מגבלות AI</div>
              <div><strong>תרגול:</strong> פרויקטים על לקוחות/תקציבים אמיתיים</div>
            </div>
          </div>

          {/* Market Gaps */}
          <div className="bg-red-50 rounded-xl p-4 border border-red-200 mb-5">
            <h3 className="text-red-800 font-semibold mb-3">פערים בשוק (מהמחקר)</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-red-900">
              {[
                { icon: '🎭', title: 'הבטחות מנופחות', desc: 'קורסים משתמשים בשם "AI Marketing" אבל רוב התוכן (70-80%) הוא שיווק רגיל — SEO, PPC, סושיאל.' },
                { icon: '🔧', title: 'AI ללא הקשר', desc: 'מלמדים להשתמש בכלים אבל לא מתי ולמה. חסרה שאלת "האם בכלל צריך AI כאן?"' },
                { icon: '📊', title: 'יצירה בלי מדידה', desc: 'בוגרים יודעים לייצר 50 פוסטים אבל לא יודעים לבדוק מה עבד.' },
                { icon: '⚠️', title: 'טעויות AI לא נלמדות', desc: 'מה קורה כש-AI ממציא עובדות? מפלה קהלים? חושף מידע רגיש?' },
                { icon: '🎮', title: 'תרגול על "דמה"', desc: 'סימולציות ותיקי עבודה מדומים לא מכינים למציאות.' },
                { icon: '💰', title: 'ציפיות לא ריאליות', desc: '"AI יחסוך 90% מהזמן" — במציאות החיסכון הוא 10-20%.' },
              ].map((gap, idx) => (
                <div key={idx} className="bg-red-100 p-3 rounded-lg">
                  <strong className="block mb-1.5">{gap.icon} {gap.title}</strong>
                  {gap.desc}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-100 rounded-xl p-4 border border-blue-300">
            <h3 className="text-blue-800 font-semibold mb-2.5">המלצות לשקול</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-blue-900">
              <div>• ליווי ממושך אחרי סיום (כמה חודשים?)</div>
              <div>• תרגול על תקציבים אמיתיים</div>
              <div>• שקיפות בנתוני השמה</div>
              <div>• Soft Skills מובנים בתוכנית</div>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Tab - Exact match to HTML original */}
      {activeTab === 'calculator' && (() => {
        // VAT rate
        const VAT = 0.17

        // Calculate effective students (after cancellations)
        const effectiveStudents = calc.students * (1 - calc.cancellationRate / 100)

        // Revenue calculations (net of VAT)
        const priceNet = calc.price / (1 + VAT)
        const baseRevenue = effectiveStudents * priceNet
        const extraRevenueNet = calc.extraMaterials / (1 + VAT)
        const totalRevenueNet = baseRevenue + extraRevenueNet

        // Per student expenses
        const perStudentTotal = (calc.gifts + calc.certificates) * (1 + VAT) + calc.cpl
        const salesCommissionAmount = (calc.salesCommission / 100) * priceNet * effectiveStudents
        const totalPerStudent = (perStudentTotal * effectiveStudents) + salesCommissionAmount

        // Per session expenses
        const perSessionTotal = (calc.roomRent + calc.refreshments + calc.techProduction) * (1 + VAT) + calc.mainInstructor + calc.assistant
        const totalPerSession = perSessionTotal * calc.sessions

        // Per cohort expenses
        const perCohortTotal = (calc.marketingAgency + calc.marketingCreative + calc.landingPage + calc.materials) * (1 + VAT) + calc.partialRefunds

        // Fixed monthly expenses
        const monthlyFixed = calc.salaryManager + (calc.software + calc.overhead) * (1 + VAT)
        const totalFixed = monthlyFixed * calc.cohortMonths

        // Total expenses (net)
        const totalExpensesNet = totalPerStudent + totalPerSession + perCohortTotal + totalFixed

        // Profit
        const grossProfit = totalRevenueNet - totalExpensesNet
        const profitMargin = totalRevenueNet > 0 ? (grossProfit / totalRevenueNet) * 100 : 0

        // Breakeven
        const fixedCosts = perCohortTotal + totalFixed + totalPerSession
        const variableCostPerStudent = (perStudentTotal + salesCommissionAmount / effectiveStudents)
        const revenuePerStudent = priceNet
        const breakeven = fixedCosts / (revenuePerStudent - variableCostPerStudent)

        const formatCurrency = (num: number) => `₪${Math.round(num).toLocaleString()}`

        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6 pb-3 border-b-2 border-gray-200">
              מחשבון רווחיות למחזור
            </h2>

            {/* Toolbar */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                📤 ייצוא הגדרות
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                📥 ייבוא הגדרות
              </button>
              <button
                onClick={() => setCalc({
                  students: 40, sessions: 30, price: 18000, cancellationRate: 5,
                  extraMaterials: 0, gifts: 75, certificates: 200, cpl: 1000, salesCommission: 5,
                  roomRent: 500, mainInstructor: 500, assistant: 0, refreshments: 200, techProduction: 0,
                  marketingAgency: 0, marketingCreative: 0, landingPage: 0, materials: 1000, partialRefunds: 200,
                  cohortMonths: 6, salaryManager: 0, software: 1500, overhead: 200,
                })}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                🔄 איפוס לברירת מחדל
              </button>
            </div>

            {/* Calculator Grid - 3 columns */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Basic Params */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-800 text-sm">פרמטרים בסיסיים</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">בסיס</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'סטודנטים במחזור', key: 'students' },
                    { label: 'מספר מפגשים', key: 'sessions' },
                    { label: 'מחיר לתלמיד (כולל מע"מ)', key: 'price' },
                    { label: 'ביטולים מלאים (%)', key: 'cancellationRate', unit: '%' },
                  ].map(item => (
                    <div key={item.key} className="flex justify-between items-center p-2 bg-white rounded-lg border">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={calc[item.key as keyof typeof calc]}
                          onChange={(e) => setCalc({ ...calc, [item.key]: parseFloat(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 border rounded text-left text-sm"
                        />
                        {item.unit && <span className="text-xs text-gray-400">{item.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Revenue */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-green-800 text-sm">הכנסות נוספות</span>
                  <span className="text-xs px-2 py-0.5 bg-green-200 text-green-700 rounded-full">הכנסה</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg border">
                    <span className="text-sm text-gray-600">מכירת חומרי לימוד</span>
                    <input
                      type="number"
                      value={calc.extraMaterials}
                      onChange={(e) => setCalc({ ...calc, extraMaterials: parseFloat(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 border rounded text-left text-sm"
                    />
                  </div>
                </div>
                <div className="mt-3 p-3 bg-green-100 rounded-lg flex justify-between">
                  <span className="text-sm font-semibold">סה"כ</span>
                  <span className="text-sm font-bold text-green-700">{formatCurrency(extraRevenueNet)}</span>
                </div>
              </div>

              {/* Per Student Expenses */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-blue-800 text-sm">הוצאות לפי תלמיד</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-700 rounded-full">× סטודנטים</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'מתנות פתיחה', key: 'gifts' },
                    { label: 'תעודות וחומרים', key: 'certificates' },
                    { label: 'עלות רכישת ליד (Meta)', key: 'cpl' },
                    { label: 'עמלת מכירות', key: 'salesCommission', unit: '%' },
                  ].map(item => (
                    <div key={item.key} className="flex justify-between items-center p-2 bg-white rounded-lg border">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={calc[item.key as keyof typeof calc]}
                          onChange={(e) => setCalc({ ...calc, [item.key]: parseFloat(e.target.value) || 0 })}
                          className="w-16 px-2 py-1 border rounded text-left text-xs"
                        />
                        {item.unit && <span className="text-xs text-gray-400">{item.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-blue-100 rounded-lg flex justify-between">
                  <span className="text-sm font-semibold">סה"כ (× סטודנטים)</span>
                  <span className="text-sm font-bold text-blue-700">{formatCurrency(totalPerStudent)}</span>
                </div>
              </div>

              {/* Per Session Expenses */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-orange-800 text-sm">הוצאות לפי מפגש</span>
                  <span className="text-xs px-2 py-0.5 bg-orange-200 text-orange-700 rounded-full">× מפגשים</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'שכירות כיתה', key: 'roomRent' },
                    { label: 'מרצה ראשי', key: 'mainInstructor' },
                    { label: 'מתרגל/עוזר הוראה', key: 'assistant' },
                    { label: 'כיבוד', key: 'refreshments' },
                    { label: 'הפקה טכנית', key: 'techProduction' },
                  ].map(item => (
                    <div key={item.key} className="flex justify-between items-center p-2 bg-white rounded-lg border">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <input
                        type="number"
                        value={calc[item.key as keyof typeof calc]}
                        onChange={(e) => setCalc({ ...calc, [item.key]: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 border rounded text-left text-xs"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-orange-100 rounded-lg flex justify-between">
                  <span className="text-sm font-semibold">סה"כ (× מפגשים)</span>
                  <span className="text-sm font-bold text-orange-700">{formatCurrency(totalPerSession)}</span>
                </div>
              </div>

              {/* Per Cohort Expenses */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-emerald-800 text-sm">הוצאות למחזור</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-200 text-emerald-700 rounded-full">קבוע למחזור</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'שיווק — קמפיינר/סוכנות', key: 'marketingAgency' },
                    { label: 'שיווק — קריאייטיב ותוכן', key: 'marketingCreative' },
                    { label: 'דף נחיתה/אתר', key: 'landingPage' },
                    { label: 'הכנת חומרי לימוד', key: 'materials' },
                    { label: 'זיכויים/החזרים חלקיים', key: 'partialRefunds' },
                  ].map(item => (
                    <div key={item.key} className="flex justify-between items-center p-2 bg-white rounded-lg border">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <input
                        type="number"
                        value={calc[item.key as keyof typeof calc]}
                        onChange={(e) => setCalc({ ...calc, [item.key]: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 border rounded text-left text-xs"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-emerald-100 rounded-lg flex justify-between">
                  <span className="text-sm font-semibold">סה"כ</span>
                  <span className="text-sm font-bold text-emerald-700">{formatCurrency(perCohortTotal)}</span>
                </div>
              </div>

              {/* Fixed Expenses */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-purple-800 text-sm">הוצאות קבועות (הקצאה)</span>
                  <span className="text-xs px-2 py-0.5 bg-purple-200 text-purple-700 rounded-full">× חודשים</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'משך מחזור', key: 'cohortMonths', isParam: true },
                    { label: 'משכורת מנהל תוכנית', key: 'salaryManager' },
                    { label: 'תוכנות (LMS, CRM)', key: 'software' },
                    { label: 'הנהלה וכלליות', key: 'overhead' },
                  ].map(item => (
                    <div key={item.key} className="flex justify-between items-center p-2 bg-white rounded-lg border">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <input
                        type="number"
                        value={calc[item.key as keyof typeof calc]}
                        onChange={(e) => setCalc({ ...calc, [item.key]: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 border rounded text-left text-xs"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-purple-100 rounded-lg flex justify-between">
                  <span className="text-sm font-semibold">סה"כ (× חודשים)</span>
                  <span className="text-sm font-bold text-purple-700">{formatCurrency(totalFixed)}</span>
                </div>
              </div>
            </div>

            {/* Results Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-emerald-500 text-white rounded-xl p-5 text-center">
                <div className="text-3xl font-bold">{formatCurrency(totalRevenueNet)}</div>
                <div className="text-sm opacity-90">הכנסה למחזור (נטו)</div>
                <div className="text-xs opacity-75 mt-1">{formatCurrency(totalRevenueNet / effectiveStudents)} לסטודנט</div>
              </div>
              <div className="bg-rose-500 text-white rounded-xl p-5 text-center">
                <div className="text-3xl font-bold">{formatCurrency(totalExpensesNet)}</div>
                <div className="text-sm opacity-90">הוצאות למחזור (נטו)</div>
                <div className="text-xs opacity-75 mt-1">{formatCurrency(totalExpensesNet / effectiveStudents)} לסטודנט</div>
              </div>
              <div className={`${grossProfit >= 0 ? 'bg-blue-600' : 'bg-red-600'} text-white rounded-xl p-5 text-center`}>
                <div className="text-3xl font-bold">{formatCurrency(grossProfit)}</div>
                <div className="text-sm opacity-90">רווח גולמי למחזור</div>
                <div className="text-xs opacity-75 mt-1">{profitMargin.toFixed(1)}% מרווח</div>
              </div>
              <div className="bg-amber-500 text-white rounded-xl p-5 text-center">
                <div className="text-3xl font-bold">{Math.ceil(breakeven)}</div>
                <div className="text-sm opacity-90">נקודת איזון</div>
                <div className="text-xs opacity-75 mt-1">סטודנטים למחזור</div>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-4">פירוט הוצאות למחזור</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span>הוצאות לפי תלמיד ({Math.round(effectiveStudents)} תלמידים)</span>
                  <span className="font-medium">{formatCurrency(totalPerStudent)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>הוצאות לפי מפגש ({calc.sessions} מפגשים)</span>
                  <span className="font-medium">{formatCurrency(totalPerSession)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>הוצאות קבועות למחזור</span>
                  <span className="font-medium">{formatCurrency(perCohortTotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>הקצאת הוצאות קבועות ({calc.cohortMonths} חודשים)</span>
                  <span className="font-medium">{formatCurrency(totalFixed)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>מע"מ לשלטונות (משוער)</span>
                  <span className="font-medium">{formatCurrency(totalRevenueNet * VAT - totalExpensesNet * VAT * 0.3)}</span>
                </div>
                <div className="flex justify-between py-3 font-bold text-base">
                  <span>סה"כ הוצאות למחזור (נטו)</span>
                  <span>{formatCurrency(totalExpensesNet)}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, Button, EditableContent, Tabs, TabsList, TabsTrigger, TabsContent, useToast } from '@/components/ui'
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

export default function BeginnersPage() {
  const { showToast } = useToast()
  const { data: modules, setData: setModules, saving: savingModules, save: saveModules, loading: loadingModules } = useBeginnersModules()
  const { data: tasks, setData: setTasks, saving: savingTasks, save: saveTasks, loading: loadingTasks } = useBeginnersTasks()
  const { content, setContent, saving: savingContent, save: saveContent, loading: loadingContent } = useBeginnersContent()
  const { data: config, setData: setConfig, saving: savingConfig, save: saveConfig, loading: loadingConfig } = useBeginnersConfig()

  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set())
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [ownerFilter, setOwnerFilter] = useState<string>('all')

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">תוכנית למתחילים</h1>
          <p className="text-gray-600 mt-1">ניהול התוכנית לאנשים שרוצים להיכנס לעולם השיווק הדיגיטלי עם AI</p>
        </div>
        <Button onClick={handleSaveAll} loading={isSaving}>
          שמור שינויים
        </Button>
      </div>

      {/* Stats */}
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

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">תוכן</TabsTrigger>
          <TabsTrigger value="modules">מודולים ({modulesList.length})</TabsTrigger>
          <TabsTrigger value="audiences">קהלי יעד ({audiences.length})</TabsTrigger>
          <TabsTrigger value="tasks">משימות ({tasksList.length})</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content">
          <div className="grid gap-6">
            <Card title="חזון התוכנית">
              <EditableContent
                value={content.vision}
                onChange={(value) => setContent({ ...content, vision: value })}
                placeholder="הכנס את חזון התוכנית..."
              />
            </Card>

            <Card title="דרישות קדם">
              <EditableContent
                value={content.requirements}
                onChange={(value) => setContent({ ...content, requirements: value })}
                placeholder="הכנס את דרישות הקדם..."
              />
            </Card>

            <Card title="יתרונות התוכנית">
              <EditableContent
                value={content.advantages}
                onChange={(value) => setContent({ ...content, advantages: value })}
                placeholder="הכנס את יתרונות התוכנית..."
              />
            </Card>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                סה״כ: {modulesList.length} מודולים, {totalHours} שעות
              </div>
              <Button onClick={addModule} variant="secondary">
                + הוסף מודול
              </Button>
            </div>

            <div className="space-y-4">
              {modulesList.sort((a, b) => a.order - b.order).map((module, index) => (
                <div
                  key={module.id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden"
                  style={{ borderRightWidth: '4px', borderRightColor: module.color }}
                >
                  {/* Module Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
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
                            className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                          />
                          <div className="text-sm text-gray-500">
                            {module.topics.length} נושאים | {module.hours} שעות
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                          className="w-16 px-2 py-1 border rounded text-center"
                          min={0}
                        />
                        <span className="text-sm text-gray-500">שעות</span>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteModule(module.id)
                          }}
                          variant="danger"
                          size="sm"
                        >
                          מחק
                        </Button>
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
                  </div>

                  {/* Topics (Expanded) */}
                  {expandedModules.has(module.id) && (
                    <div className="border-t bg-gray-50 p-4 space-y-2">
                      {module.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center gap-4 p-3 bg-white rounded-lg border"
                        >
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
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addTopic(module.id)}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
                      >
                        + הוסף נושא
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {modulesList.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  אין מודולים עדיין. לחץ על &quot;הוסף מודול&quot; להתחיל.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Audiences Tab */}
        <TabsContent value="audiences">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={addAudience} variant="secondary">
                + הוסף קהל יעד
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
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
            </div>

            {audiences.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                אין קהלי יעד מוגדרים. לחץ על &quot;הוסף קהל יעד&quot; להתחיל.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  הכל ({tasksList.length})
                </button>
                {categories.map((cat) => {
                  const count = tasksList.filter(t => t.category === cat).length
                  const colors = categoryColors[cat]
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors`}
                      style={{
                        backgroundColor: categoryFilter === cat ? colors.border : colors.bg,
                        color: categoryFilter === cat ? 'white' : colors.text,
                      }}
                    >
                      {cat} ({count})
                    </button>
                  )
                })}
              </div>
              <Button onClick={addTask} variant="secondary">
                + הוסף משימה
              </Button>
            </div>

            {/* Owner Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">אחראי:</span>
              <button
                onClick={() => setOwnerFilter('all')}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  ownerFilter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'
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
                    className={`px-3 py-1 rounded-full text-sm border transition-colors`}
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

            <Card>
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
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}

                {filteredTasks.length === 0 && (
                  <p className="text-center text-gray-500 py-8">אין משימות בקטגוריה זו</p>
                )}
              </div>
            </Card>

            {/* Progress Bar */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">התקדמות: {completedTasks}/{tasksList.length}</span>
                <span className="text-sm font-medium text-gray-900">
                  {tasksList.length > 0 ? Math.round((completedTasks / tasksList.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${tasksList.length > 0 ? (completedTasks / tasksList.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

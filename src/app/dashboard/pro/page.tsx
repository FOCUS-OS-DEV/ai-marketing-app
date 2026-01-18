'use client'

import { useState } from 'react'
import { Card, Button, EditableContent, Tabs, TabsList, TabsTrigger, TabsContent, useToast } from '@/components/ui'
import { useProModules, useProTasks, useProAudiences, useProContent } from '@/hooks/useSupabaseData'

interface Module {
  id: string
  name: string
  duration: string
  description: string
  level: 'advanced' | 'expert'
}

interface Task {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

interface Audience {
  id: string
  name: string
  description: string
  characteristics: string[]
}

export default function ProPage() {
  const { showToast } = useToast()
  const { data: modules, setData: setModules, saving: savingModules, save: saveModules } = useProModules()
  const { data: tasks, setData: setTasks, saving: savingTasks, save: saveTasks } = useProTasks()
  const { data: audiences, setData: setAudiences, saving: savingAudiences, save: saveAudiences } = useProAudiences()
  const { content, setContent, saving: savingContent, save: saveContent } = useProContent()

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

  // Module functions
  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      name: 'מודול מתקדם חדש',
      duration: '3 שעות',
      description: '',
      level: 'advanced',
    }
    setModules([...(modules as Module[]), newModule])
  }

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules((modules as Module[]).map((m: Module) => m.id === id ? { ...m, ...updates } : m))
  }

  const deleteModule = (id: string) => {
    setModules((modules as Module[]).filter((m: Module) => m.id !== id))
  }

  // Task functions
  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: 'משימה חדשה',
      status: 'pending',
      priority: 'medium',
    }
    setTasks([...(tasks as Task[]), newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((tasks as Task[]).map((t: Task) => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTask = (id: string) => {
    setTasks((tasks as Task[]).filter((t: Task) => t.id !== id))
  }

  // Audience functions
  const addAudience = () => {
    const newAudience: Audience = {
      id: Date.now().toString(),
      name: 'קהל יעד חדש',
      description: '',
      characteristics: [],
    }
    setAudiences([...(audiences as Audience[]), newAudience])
  }

  const updateAudience = (id: string, updates: Partial<Audience>) => {
    setAudiences((audiences as Audience[]).map((a: Audience) => a.id === id ? { ...a, ...updates } : a))
  }

  const deleteAudience = (id: string) => {
    setAudiences((audiences as Audience[]).filter((a: Audience) => a.id !== id))
  }

  const isSaving = savingModules || savingTasks || savingAudiences || savingContent

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">תוכנית Pro</h1>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
              PRO
            </span>
          </div>
          <p className="text-gray-600 mt-1">למשווקים מנוסים שרוצים לשדרג עם כלי AI מתקדמים</p>
        </div>
        <Button onClick={handleSaveAll} loading={isSaving}>
          שמור שינויים
        </Button>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">תוכן</TabsTrigger>
          <TabsTrigger value="modules">מודולים ({(modules as Module[]).length})</TabsTrigger>
          <TabsTrigger value="audiences">קהלי יעד ({(audiences as Audience[]).length})</TabsTrigger>
          <TabsTrigger value="tasks">משימות ({(tasks as Task[]).length})</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content">
          <Card title="חזון התוכנית Pro">
            <EditableContent
              value={content.vision}
              onChange={(value) => setContent({ ...content, vision: value })}
              placeholder="הכנס את חזון התוכנית..."
            />
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <div className="space-y-4">
            <Button onClick={addModule} variant="secondary">
              + הוסף מודול מתקדם
            </Button>

            <div className="grid gap-4">
              {(modules as Module[]).map((module: Module, index: number) => (
                <Card key={module.id}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={module.name}
                          onChange={(e) => updateModule(module.id, { name: e.target.value })}
                          className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <select
                          value={module.level}
                          onChange={(e) => updateModule(module.id, { level: e.target.value as Module['level'] })}
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            module.level === 'expert'
                              ? 'bg-pink-100 text-pink-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          <option value="advanced">מתקדם</option>
                          <option value="expert">מומחה</option>
                        </select>
                      </div>
                      <Button onClick={() => deleteModule(module.id)} variant="danger" size="sm">
                        מחק
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">משך</label>
                        <input
                          type="text"
                          value={module.duration}
                          onChange={(e) => updateModule(module.id, { duration: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500">תיאור</label>
                      <textarea
                        value={module.description}
                        onChange={(e) => updateModule(module.id, { description: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none min-h-[80px]"
                        placeholder="תיאור המודול..."
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Audiences Tab */}
        <TabsContent value="audiences">
          <div className="space-y-4">
            <Button onClick={addAudience} variant="secondary">
              + הוסף קהל יעד
            </Button>

            <div className="grid gap-4 md:grid-cols-2">
              {(audiences as Audience[]).map((audience: Audience) => (
                <Card key={audience.id}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={audience.name}
                        onChange={(e) => updateAudience(audience.id, { name: e.target.value })}
                        className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none transition-colors"
                      />
                      <Button onClick={() => deleteAudience(audience.id)} variant="ghost" size="sm">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>

                    <textarea
                      value={audience.description}
                      onChange={(e) => updateAudience(audience.id, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none min-h-[60px]"
                      placeholder="תיאור קהל היעד..."
                    />
                  </div>
                </Card>
              ))}

              {(audiences as Audience[]).length === 0 && (
                <div className="col-span-2 text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">אין קהלי יעד עדיין</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="space-y-4">
            <Button onClick={addTask} variant="secondary">
              + הוסף משימה
            </Button>

            <Card>
              <div className="space-y-2">
                {(tasks as Task[]).map((task: Task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <select
                        value={task.priority}
                        onChange={(e) => updateTask(task.id, { priority: e.target.value as Task['priority'] })}
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        <option value="low">נמוך</option>
                        <option value="medium">בינוני</option>
                        <option value="high">גבוה</option>
                      </select>
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value as Task['status'] })}
                        className={`px-2 py-1 rounded-lg text-sm font-medium ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <option value="pending">ממתין</option>
                        <option value="in_progress">בתהליך</option>
                        <option value="completed">הושלם</option>
                      </select>
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => updateTask(task.id, { name: e.target.value })}
                        className="bg-transparent border-none focus:outline-none"
                      />
                    </div>
                    <Button onClick={() => deleteTask(task.id)} variant="ghost" size="sm">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                ))}

                {(tasks as Task[]).length === 0 && (
                  <p className="text-center text-gray-500 py-8">אין משימות עדיין</p>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

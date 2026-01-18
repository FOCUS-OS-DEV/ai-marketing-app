'use client'

import { useState } from 'react'
import { Card, Button, EditableContent, Tabs, TabsList, TabsTrigger, TabsContent, useToast } from '@/components/ui'
import { useBeginnersModules, useBeginnersTasks, useBeginnersContent } from '@/hooks/useSupabaseData'

interface Module {
  id: string
  name: string
  duration: string
  description: string
  topics: string[]
}

interface Task {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed'
}

export default function BeginnersPage() {
  const { showToast } = useToast()
  const { data: modules, setData: setModules, saving: savingModules, save: saveModules } = useBeginnersModules()
  const { data: tasks, setData: setTasks, saving: savingTasks, save: saveTasks } = useBeginnersTasks()
  const { content, setContent, saving: savingContent, save: saveContent } = useBeginnersContent()

  const handleSaveAll = async () => {
    try {
      await Promise.all([
        saveModules(modules),
        saveTasks(tasks),
        saveContent(content),
      ])
      showToast('נשמר בהצלחה!', 'success')
    } catch {
      showToast('שגיאה בשמירה', 'error')
    }
  }

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      name: 'מודול חדש',
      duration: '2 שעות',
      description: '',
      topics: [],
    }
    setModules([...(modules as Module[]), newModule])
  }

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules((modules as Module[]).map((m: Module) => m.id === id ? { ...m, ...updates } : m))
  }

  const deleteModule = (id: string) => {
    setModules((modules as Module[]).filter((m: Module) => m.id !== id))
  }

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: 'משימה חדשה',
      status: 'pending',
    }
    setTasks([...(tasks as Task[]), newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((tasks as Task[]).map((t: Task) => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTask = (id: string) => {
    setTasks((tasks as Task[]).filter((t: Task) => t.id !== id))
  }

  const isSaving = savingModules || savingTasks || savingContent

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

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">תוכן</TabsTrigger>
          <TabsTrigger value="modules">מודולים ({(modules as Module[]).length})</TabsTrigger>
          <TabsTrigger value="tasks">משימות ({(tasks as Task[]).length})</TabsTrigger>
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
            <Button onClick={addModule} variant="secondary">
              + הוסף מודול
            </Button>

            <div className="grid gap-4">
              {(modules as Module[]).map((module: Module, index: number) => (
                <Card key={module.id}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={module.name}
                          onChange={(e) => updateModule(module.id, { name: e.target.value })}
                          className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                        />
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
                          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500">תיאור</label>
                      <textarea
                        value={module.description}
                        onChange={(e) => updateModule(module.id, { description: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none min-h-[80px]"
                        placeholder="תיאור המודול..."
                      />
                    </div>
                  </div>
                </Card>
              ))}
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
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value as Task['status'] })}
                        className={`px-2 py-1 rounded-lg text-sm font-medium ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : task.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-700'
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

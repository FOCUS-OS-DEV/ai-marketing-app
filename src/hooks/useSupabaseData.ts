'use client'

import { useState, useEffect, useCallback } from 'react'
import { createUntypedClient, type Json } from '@/lib/supabase/db'

type JsonTableName = 'beginners_config' | 'beginners_modules' | 'beginners_tasks' |
  'pro_config' | 'pro_modules' | 'pro_tasks' | 'pro_audiences'

interface UseJsonDataOptions<T> {
  tableName: JsonTableName
  defaultValue: T
}

export function useSupabaseData<T>({ tableName, defaultValue }: UseJsonDataOptions<T>) {
  const [data, setData] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const supabase = createUntypedClient()
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (result?.data) {
        setData(result.data as T)
      }
    } catch (err) {
      console.error(`Error loading ${tableName}:`, err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [tableName])

  const save = useCallback(async (newData: T) => {
    setSaving(true)
    setError(null)
    const supabase = createUntypedClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from(tableName)
        .update({
          data: newData as Json,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .not('id', 'is', null)

      if (error) throw error

      setData(newData)
    } catch (err) {
      console.error(`Error saving ${tableName}:`, err)
      setError(err instanceof Error ? err.message : 'Failed to save data')
      throw err
    } finally {
      setSaving(false)
    }
  }, [tableName])

  useEffect(() => {
    load()
  }, [load])

  return { data, setData, loading, saving, error, save, reload: load }
}

// Specialized hooks for each data type
export function useBeginnersConfig() {
  return useSupabaseData({
    tableName: 'beginners_config',
    defaultValue: {} as Record<string, unknown>,
  })
}

export function useBeginnersModules() {
  return useSupabaseData({
    tableName: 'beginners_modules',
    defaultValue: [] as unknown[],
  })
}

export function useBeginnersTasks() {
  return useSupabaseData({
    tableName: 'beginners_tasks',
    defaultValue: [] as unknown[],
  })
}

export function useBeginnersContent() {
  const [content, setContent] = useState({ vision: '', requirements: '', advantages: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createUntypedClient()
    try {
      const { data, error } = await supabase
        .from('beginners_content')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (data) {
        setContent({
          vision: data.vision || '',
          requirements: data.requirements || '',
          advantages: data.advantages || '',
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  const save = useCallback(async (newContent: typeof content) => {
    setSaving(true)
    const supabase = createUntypedClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('beginners_content')
        .update({
          ...newContent,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .not('id', 'is', null)

      if (error) throw error
      setContent(newContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { content, setContent, loading, saving, error, save, reload: load }
}

export function useProConfig() {
  return useSupabaseData({
    tableName: 'pro_config',
    defaultValue: {} as Record<string, unknown>,
  })
}

export function useProModules() {
  return useSupabaseData({
    tableName: 'pro_modules',
    defaultValue: [] as unknown[],
  })
}

export function useProTasks() {
  return useSupabaseData({
    tableName: 'pro_tasks',
    defaultValue: [] as unknown[],
  })
}

export function useProAudiences() {
  return useSupabaseData({
    tableName: 'pro_audiences',
    defaultValue: [] as unknown[],
  })
}

export function useProContent() {
  const [content, setContent] = useState({ vision: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createUntypedClient()
    try {
      const { data, error } = await supabase
        .from('pro_content')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (data) {
        setContent({ vision: data.vision || '' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  const save = useCallback(async (newContent: typeof content) => {
    setSaving(true)
    const supabase = createUntypedClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('pro_content')
        .update({
          ...newContent,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .not('id', 'is', null)

      if (error) throw error
      setContent(newContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { content, setContent, loading, saving, error, save, reload: load }
}

// Audit log hook
export function useAuditLog(limit = 50) {
  const [logs, setLogs] = useState<Array<{
    id: string
    user_email: string | null
    action: string
    table_name: string
    created_at: string
    old_data: Json | null
    new_data: Json | null
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createUntypedClient()
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!error && data) {
        setLogs(data)
      }
      setLoading(false)
    }
    load()
  }, [limit])

  return { logs, loading }
}

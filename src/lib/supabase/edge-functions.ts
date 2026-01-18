'use client'

import { createBrowserClient } from '@supabase/ssr'

// Edge Functions helper for calling Supabase Edge Functions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Get the current user's session token
async function getAuthToken(): Promise<string | null> {
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

// Base function to call Edge Functions
async function callEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { data: null, error: 'Not authenticated' }
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/${functionName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result.error || 'Request failed' }
    }

    return { data: result as T, error: null }
  } catch (error) {
    console.error(`Edge function ${functionName} error:`, error)
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ============ Audit Log Functions ============

interface AuditLogEntry {
  action: 'create' | 'update' | 'delete'
  table_name: string
  record_id?: string
  old_data?: Record<string, unknown>
  new_data?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export async function logAuditEvent(entry: AuditLogEntry) {
  return callEdgeFunction('audit-log', entry as unknown as Record<string, unknown>)
}

// ============ Calculator Functions ============

export interface CalculatorInput {
  students: number
  sessions: number
  price: number
  cancellationRate: number
  extraMaterials: number
  gifts: number
  certificates: number
  cpl: number
  salesCommission: number
  roomRent: number
  mainInstructor: number
  assistant: number
  refreshments: number
  techProduction: number
  marketingAgency: number
  marketingCreative: number
  landingPage: number
  materials: number
  partialRefunds: number
  cohortMonths: number
  salaryManager: number
  software: number
  overhead: number
}

export interface CalculatorResult {
  effectiveStudents: number
  totalRevenueNet: number
  totalExpensesNet: number
  grossProfit: number
  profitMargin: number
  breakeven: number
  baseRevenue: number
  extraRevenueNet: number
  totalPerStudent: number
  totalPerSession: number
  perCohortTotal: number
  totalFixed: number
  vatToGovernment: number
  revenuePerStudent: number
  expensesPerStudent: number
  profitPerStudent: number
}

export async function calculateProfitability(
  data: CalculatorInput,
  programType: 'beginners' | 'pro' = 'beginners'
) {
  return callEdgeFunction<{ success: boolean; result: CalculatorResult }>(
    'calculator',
    { action: 'calculate', data, programType }
  )
}

export async function saveCalculatorConfig(
  data: CalculatorInput,
  programType: 'beginners' | 'pro' = 'beginners'
) {
  return callEdgeFunction<{ success: boolean; result: CalculatorResult; saved: boolean }>(
    'calculator',
    { action: 'save', data, programType }
  )
}

export async function loadCalculatorConfig(programType: 'beginners' | 'pro' = 'beginners') {
  return callEdgeFunction<{ success: boolean; data: CalculatorInput | null }>(
    'calculator',
    { action: 'load', programType }
  )
}

// ============ Save Data Functions ============

type ValidTableName =
  | 'beginners_config' | 'beginners_modules' | 'beginners_tasks' | 'beginners_content'
  | 'pro_config' | 'pro_modules' | 'pro_tasks' | 'pro_audiences' | 'pro_content'

export async function saveData(table: ValidTableName, data: unknown) {
  return callEdgeFunction<{ success: boolean; data: unknown }>(
    'save-data',
    { table, data }
  )
}

export async function batchSaveData(
  saves: Array<{ table: ValidTableName; data: unknown }>
) {
  return callEdgeFunction<{
    success: boolean
    results: Array<{ table: string; success: boolean; error?: string }>
  }>('save-data', { saves })
}

// ============ Convenience Functions for Specific Tables ============

// Beginners program
export const beginners = {
  saveModules: (data: unknown) => saveData('beginners_modules', data),
  saveTasks: (data: unknown) => saveData('beginners_tasks', data),
  saveConfig: (data: unknown) => saveData('beginners_config', data),
  saveContent: (data: unknown) => saveData('beginners_content', data),
  saveAll: (data: {
    modules?: unknown
    tasks?: unknown
    config?: unknown
    content?: unknown
  }) => {
    const saves: Array<{ table: ValidTableName; data: unknown }> = []
    if (data.modules !== undefined) saves.push({ table: 'beginners_modules', data: data.modules })
    if (data.tasks !== undefined) saves.push({ table: 'beginners_tasks', data: data.tasks })
    if (data.config !== undefined) saves.push({ table: 'beginners_config', data: data.config })
    if (data.content !== undefined) saves.push({ table: 'beginners_content', data: data.content })
    return batchSaveData(saves)
  },
}

// Pro program
export const pro = {
  saveModules: (data: unknown) => saveData('pro_modules', data),
  saveTasks: (data: unknown) => saveData('pro_tasks', data),
  saveConfig: (data: unknown) => saveData('pro_config', data),
  saveContent: (data: unknown) => saveData('pro_content', data),
  saveAudiences: (data: unknown) => saveData('pro_audiences', data),
  saveAll: (data: {
    modules?: unknown
    tasks?: unknown
    config?: unknown
    content?: unknown
    audiences?: unknown
  }) => {
    const saves: Array<{ table: ValidTableName; data: unknown }> = []
    if (data.modules !== undefined) saves.push({ table: 'pro_modules', data: data.modules })
    if (data.tasks !== undefined) saves.push({ table: 'pro_tasks', data: data.tasks })
    if (data.config !== undefined) saves.push({ table: 'pro_config', data: data.config })
    if (data.content !== undefined) saves.push({ table: 'pro_content', data: data.content })
    if (data.audiences !== undefined) saves.push({ table: 'pro_audiences', data: data.audiences })
    return batchSaveData(saves)
  },
}

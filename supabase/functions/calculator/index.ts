// Calculator Edge Function
// Performs profitability calculations server-side

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalculatorInput {
  // Basic params
  students: number
  sessions: number
  price: number
  cancellationRate: number
  // Additional revenue
  extraMaterials: number
  // Per student expenses
  gifts: number
  certificates: number
  cpl: number
  salesCommission: number
  // Per session expenses
  roomRent: number
  mainInstructor: number
  assistant: number
  refreshments: number
  techProduction: number
  // Per cohort expenses
  marketingAgency: number
  marketingCreative: number
  landingPage: number
  materials: number
  partialRefunds: number
  // Fixed expenses
  cohortMonths: number
  salaryManager: number
  software: number
  overhead: number
}

interface CalculatorResult {
  // Core metrics
  effectiveStudents: number
  totalRevenueNet: number
  totalExpensesNet: number
  grossProfit: number
  profitMargin: number
  breakeven: number
  // Breakdown
  baseRevenue: number
  extraRevenueNet: number
  totalPerStudent: number
  totalPerSession: number
  perCohortTotal: number
  totalFixed: number
  // VAT info
  vatToGovernment: number
  // Per student metrics
  revenuePerStudent: number
  expensesPerStudent: number
  profitPerStudent: number
}

const VAT = 0.17

function calculateProfitability(input: CalculatorInput): CalculatorResult {
  // Calculate effective students (after cancellations)
  const effectiveStudents = input.students * (1 - input.cancellationRate / 100)

  // Revenue calculations (net of VAT)
  const priceNet = input.price / (1 + VAT)
  const baseRevenue = effectiveStudents * priceNet
  const extraRevenueNet = input.extraMaterials / (1 + VAT)
  const totalRevenueNet = baseRevenue + extraRevenueNet

  // Per student expenses
  const perStudentBase = (input.gifts + input.certificates) * (1 + VAT) + input.cpl
  const salesCommissionAmount = (input.salesCommission / 100) * priceNet * effectiveStudents
  const totalPerStudent = (perStudentBase * effectiveStudents) + salesCommissionAmount

  // Per session expenses
  const perSessionBase = (input.roomRent + input.refreshments + input.techProduction) * (1 + VAT) +
                         input.mainInstructor + input.assistant
  const totalPerSession = perSessionBase * input.sessions

  // Per cohort expenses
  const perCohortTotal = (input.marketingAgency + input.marketingCreative + input.landingPage + input.materials) *
                         (1 + VAT) + input.partialRefunds

  // Fixed monthly expenses
  const monthlyFixed = input.salaryManager + (input.software + input.overhead) * (1 + VAT)
  const totalFixed = monthlyFixed * input.cohortMonths

  // Total expenses
  const totalExpensesNet = totalPerStudent + totalPerSession + perCohortTotal + totalFixed

  // Profit calculations
  const grossProfit = totalRevenueNet - totalExpensesNet
  const profitMargin = totalRevenueNet > 0 ? (grossProfit / totalRevenueNet) * 100 : 0

  // Breakeven calculation
  const fixedCosts = perCohortTotal + totalFixed + totalPerSession
  const variableCostPerStudent = effectiveStudents > 0
    ? (perStudentBase + salesCommissionAmount / effectiveStudents)
    : 0
  const revenuePerStudent = priceNet
  const breakeven = (revenuePerStudent - variableCostPerStudent) > 0
    ? fixedCosts / (revenuePerStudent - variableCostPerStudent)
    : Infinity

  // VAT to government (estimated)
  const vatToGovernment = totalRevenueNet * VAT - totalExpensesNet * VAT * 0.3

  return {
    effectiveStudents,
    totalRevenueNet,
    totalExpensesNet,
    grossProfit,
    profitMargin,
    breakeven: Math.ceil(breakeven),
    baseRevenue,
    extraRevenueNet,
    totalPerStudent,
    totalPerSession,
    perCohortTotal,
    totalFixed,
    vatToGovernment,
    revenuePerStudent: effectiveStudents > 0 ? totalRevenueNet / effectiveStudents : 0,
    expensesPerStudent: effectiveStudents > 0 ? totalExpensesNet / effectiveStudents : 0,
    profitPerStudent: effectiveStudents > 0 ? grossProfit / effectiveStudents : 0,
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request
    const { action, data: inputData, programType = 'beginners' } = await req.json()

    if (action === 'calculate') {
      // Perform calculation
      const result = calculateProfitability(inputData as CalculatorInput)

      return new Response(
        JSON.stringify({ success: true, result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'save') {
      // Save calculator config to database
      const tableName = programType === 'pro' ? 'pro_config' : 'beginners_config'

      const { error } = await supabase
        .from(tableName)
        .update({
          data: { calculator: inputData },
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .not('id', 'is', null)

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to save calculator config', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Also perform calculation for the saved data
      const result = calculateProfitability(inputData as CalculatorInput)

      // Log the save action
      await supabase.from('audit_log').insert({
        user_id: user.id,
        user_email: user.email,
        action: 'update',
        table_name: tableName,
        new_data: { calculator: inputData },
        metadata: { calculated_profit: result.grossProfit },
        created_at: new Date().toISOString(),
      })

      return new Response(
        JSON.stringify({ success: true, result, saved: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'load') {
      // Load calculator config from database
      const tableName = programType === 'pro' ? 'pro_config' : 'beginners_config'

      const { data, error } = await supabase
        .from(tableName)
        .select('data')
        .single()

      if (error && error.code !== 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Failed to load calculator config', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const calculatorData = data?.data?.calculator || null

      return new Response(
        JSON.stringify({ success: true, data: calculatorData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use: calculate, save, or load' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Calculator error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

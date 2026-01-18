// Save Data Edge Function
// Handles all data saves with validation and audit logging

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ValidTableName =
  | 'beginners_config' | 'beginners_modules' | 'beginners_tasks' | 'beginners_content'
  | 'pro_config' | 'pro_modules' | 'pro_tasks' | 'pro_audiences' | 'pro_content'

const validTables: ValidTableName[] = [
  'beginners_config', 'beginners_modules', 'beginners_tasks', 'beginners_content',
  'pro_config', 'pro_modules', 'pro_tasks', 'pro_audiences', 'pro_content'
]

interface SaveRequest {
  table: ValidTableName
  data: unknown
  recordId?: string
}

interface BatchSaveRequest {
  saves: SaveRequest[]
}

function validateTableName(table: string): table is ValidTableName {
  return validTables.includes(table as ValidTableName)
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
    const body = await req.json()

    // Check if batch save or single save
    if (body.saves && Array.isArray(body.saves)) {
      // Batch save
      const batchRequest = body as BatchSaveRequest
      const results: { table: string; success: boolean; error?: string }[] = []

      for (const saveRequest of batchRequest.saves) {
        if (!validateTableName(saveRequest.table)) {
          results.push({ table: saveRequest.table, success: false, error: 'Invalid table name' })
          continue
        }

        try {
          // Get old data for audit log
          const { data: oldData } = await supabase
            .from(saveRequest.table)
            .select('*')
            .single()

          // Perform update
          const { error } = await supabase
            .from(saveRequest.table)
            .update({
              data: saveRequest.data,
              updated_by: user.id,
              updated_at: new Date().toISOString(),
            })
            .not('id', 'is', null)

          if (error) {
            results.push({ table: saveRequest.table, success: false, error: error.message })
            continue
          }

          // Create audit log entry
          await supabase.from('audit_log').insert({
            user_id: user.id,
            user_email: user.email,
            action: 'update',
            table_name: saveRequest.table,
            old_data: oldData?.data,
            new_data: saveRequest.data,
            created_at: new Date().toISOString(),
          })

          results.push({ table: saveRequest.table, success: true })
        } catch (err) {
          results.push({ table: saveRequest.table, success: false, error: err.message })
        }
      }

      return new Response(
        JSON.stringify({ success: true, results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Single save
      const { table, data: newData } = body as SaveRequest

      if (!validateTableName(table)) {
        return new Response(
          JSON.stringify({ error: `Invalid table name: ${table}. Valid tables: ${validTables.join(', ')}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get old data for audit log
      const { data: oldRecord } = await supabase
        .from(table)
        .select('*')
        .single()

      // Perform update
      const { data: updatedData, error } = await supabase
        .from(table)
        .update({
          data: newData,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .not('id', 'is', null)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to save data', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create audit log entry
      await supabase.from('audit_log').insert({
        user_id: user.id,
        user_email: user.email,
        action: 'update',
        table_name: table,
        old_data: oldRecord?.data,
        new_data: newData,
        created_at: new Date().toISOString(),
      })

      return new Response(
        JSON.stringify({ success: true, data: updatedData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Save data error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

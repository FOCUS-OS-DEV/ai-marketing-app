export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          user_email: string | null
          action: string
          table_name: string
          record_id: string | null
          old_data: Json | null
          new_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_email?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_email?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
      }
      beginners_config: {
        Row: {
          id: string
          data: Json
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          data: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          data?: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      beginners_modules: {
        Row: {
          id: string
          data: Json
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          data: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          data?: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      beginners_tasks: {
        Row: {
          id: string
          data: Json
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          data: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          data?: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      beginners_content: {
        Row: {
          id: string
          vision: string | null
          requirements: string | null
          advantages: string | null
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          vision?: string | null
          requirements?: string | null
          advantages?: string | null
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          vision?: string | null
          requirements?: string | null
          advantages?: string | null
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      pro_config: {
        Row: {
          id: string
          data: Json
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          data: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          data?: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      pro_modules: {
        Row: {
          id: string
          data: Json
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          data: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          data?: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      pro_tasks: {
        Row: {
          id: string
          data: Json
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          data: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          data?: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      pro_audiences: {
        Row: {
          id: string
          data: Json
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          data: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          data?: Json
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      pro_content: {
        Row: {
          id: string
          vision: string | null
          updated_by: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          vision?: string | null
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          vision?: string | null
          updated_by?: string | null
          updated_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type AuditLog = Database['public']['Tables']['audit_log']['Row']

// Beginners types
export type BeginnersConfig = Database['public']['Tables']['beginners_config']['Row']
export type BeginnersModules = Database['public']['Tables']['beginners_modules']['Row']
export type BeginnersTasks = Database['public']['Tables']['beginners_tasks']['Row']
export type BeginnersContent = Database['public']['Tables']['beginners_content']['Row']

// Pro types
export type ProConfig = Database['public']['Tables']['pro_config']['Row']
export type ProModules = Database['public']['Tables']['pro_modules']['Row']
export type ProTasks = Database['public']['Tables']['pro_tasks']['Row']
export type ProAudiences = Database['public']['Tables']['pro_audiences']['Row']
export type ProContent = Database['public']['Tables']['pro_content']['Row']

// Data structure types
export interface ModuleData {
  id: string
  name: string
  duration: string
  description: string
  topics: string[]
}

export interface TaskData {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed'
  dueDate?: string
  assignee?: string
}

export interface ConfigData {
  sections?: {
    [key: string]: {
      enabled: boolean
      title: string
    }
  }
  pricing?: {
    basePrice: number
    currency: string
  }
}

export interface AudienceData {
  id: string
  name: string
  description: string
  size?: string
  characteristics: string[]
}

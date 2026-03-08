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
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'creator' | 'agency' | 'expert' | 'admin'
          plan: 'free' | 'starter' | 'pro' | 'agency'
          credits: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'creator' | 'agency' | 'expert' | 'admin'
          plan?: 'free' | 'starter' | 'pro' | 'agency'
          credits?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'creator' | 'agency' | 'expert' | 'admin'
          plan?: 'free' | 'starter' | 'pro' | 'agency'
          credits?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          brand: string | null
          thumbnail_url: string | null
          status: 'active' | 'archived' | 'deleted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          brand?: string | null
          thumbnail_url?: string | null
          status?: 'active' | 'archived' | 'deleted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          brand?: string | null
          thumbnail_url?: string | null
          status?: 'active' | 'archived' | 'deleted'
          created_at?: string
          updated_at?: string
        }
      }
      insight_reports: {
        Row: {
          id: string
          project_id: string
          user_id: string
          subject: string
          status: 'researching' | 'complete' | 'failed'
          executive_summary: string | null
          what_data_shows: Json | null
          audience_signals: Json | null
          competitive_landscape: Json | null
          cultural_tension: Json | null
          brand_archetype: Json | null
          problem_statement: string | null
          strategic_routes: Json | null
          confidence_score: number | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          subject: string
          status?: 'researching' | 'complete' | 'failed'
          executive_summary?: string | null
          what_data_shows?: Json | null
          audience_signals?: Json | null
          competitive_landscape?: Json | null
          cultural_tension?: Json | null
          brand_archetype?: Json | null
          problem_statement?: string | null
          strategic_routes?: Json | null
          confidence_score?: number | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          subject?: string
          status?: 'researching' | 'complete' | 'failed'
          executive_summary?: string | null
          what_data_shows?: Json | null
          audience_signals?: Json | null
          competitive_landscape?: Json | null
          cultural_tension?: Json | null
          brand_archetype?: Json | null
          problem_statement?: string | null
          strategic_routes?: Json | null
          confidence_score?: number | null
          created_at?: string
          completed_at?: string | null
        }
      }
      manifest_decks: {
        Row: {
          id: string
          project_id: string
          user_id: string
          insight_report_id: string | null
          title: string
          output_type: 'strategy_deck' | 'film_script' | 'social_system' | 'campaign_narrative'
          sections: Json | null
          status: 'generating' | 'complete' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          insight_report_id?: string | null
          title: string
          output_type?: 'strategy_deck' | 'film_script' | 'social_system' | 'campaign_narrative'
          sections?: Json | null
          status?: 'generating' | 'complete' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          insight_report_id?: string | null
          title?: string
          output_type?: 'strategy_deck' | 'film_script' | 'social_system' | 'campaign_narrative'
          sections?: Json | null
          status?: 'generating' | 'complete' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      craft_assets: {
        Row: {
          id: string
          project_id: string
          user_id: string
          manifest_deck_id: string | null
          type: 'image' | 'video' | 'audio'
          url: string
          thumbnail_url: string | null
          prompt: string
          model_id: string
          generation_params: Json | null
          status: 'draft' | 'in_review' | 'approved' | 'rejected' | 'archived'
          dimensions: Json | null
          duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          manifest_deck_id?: string | null
          type: 'image' | 'video' | 'audio'
          url: string
          thumbnail_url?: string | null
          prompt: string
          model_id: string
          generation_params?: Json | null
          status?: 'draft' | 'in_review' | 'approved' | 'rejected' | 'archived'
          dimensions?: Json | null
          duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          manifest_deck_id?: string | null
          type?: 'image' | 'video' | 'audio'
          url?: string
          thumbnail_url?: string | null
          prompt?: string
          model_id?: string
          generation_params?: Json | null
          status?: 'draft' | 'in_review' | 'approved' | 'rejected' | 'archived'
          dimensions?: Json | null
          duration?: number | null
          created_at?: string
        }
      }
      ai_models: {
        Row: {
          id: string
          name: string
          provider: string
          type: 'image' | 'video' | 'audio' | 'voice'
          api_endpoint: string | null
          input_schema: Json | null
          output_schema: Json | null
          pricing: Json | null
          capabilities: string[] | null
          is_active: boolean
          tier: 'fast' | 'quality' | 'ultra'
          sort_order: number
          last_verified: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          provider: string
          type: 'image' | 'video' | 'audio' | 'voice'
          api_endpoint?: string | null
          input_schema?: Json | null
          output_schema?: Json | null
          pricing?: Json | null
          capabilities?: string[] | null
          is_active?: boolean
          tier?: 'fast' | 'quality' | 'ultra'
          sort_order?: number
          last_verified?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          provider?: string
          type?: 'image' | 'video' | 'audio' | 'voice'
          api_endpoint?: string | null
          input_schema?: Json | null
          output_schema?: Json | null
          pricing?: Json | null
          capabilities?: string[] | null
          is_active?: boolean
          tier?: 'fast' | 'quality' | 'ultra'
          sort_order?: number
          last_verified?: string | null
          created_at?: string
        }
      }
      system_prompts: {
        Row: {
          id: string
          module: string
          name: string
          content: string
          temperature: number
          max_tokens: number
          is_active: boolean
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          module: string
          name: string
          content: string
          temperature?: number
          max_tokens?: number
          is_active?: boolean
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          module?: string
          name?: string
          content?: string
          temperature?: number
          max_tokens?: number
          is_active?: boolean
          updated_by?: string | null
          updated_at?: string
        }
      }
      experts: {
        Row: {
          id: string
          user_id: string
          name: string
          title: string | null
          bio: string | null
          avatar_url: string | null
          portfolio_urls: string[] | null
          hourly_rate: number | null
          minimum_budget: number | null
          response_time_hours: number
          is_available: boolean
          total_projects: number
          average_rating: number
          stripe_account_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          title?: string | null
          bio?: string | null
          avatar_url?: string | null
          portfolio_urls?: string[] | null
          hourly_rate?: number | null
          minimum_budget?: number | null
          response_time_hours?: number
          is_available?: boolean
          total_projects?: number
          average_rating?: number
          stripe_account_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          title?: string | null
          bio?: string | null
          avatar_url?: string | null
          portfolio_urls?: string[] | null
          hourly_rate?: number | null
          minimum_budget?: number | null
          response_time_hours?: number
          is_available?: boolean
          total_projects?: number
          average_rating?: number
          stripe_account_id?: string | null
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

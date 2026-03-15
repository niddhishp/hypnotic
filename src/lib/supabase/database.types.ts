// Auto-generated from Supabase schema — run `supabase gen types typescript` to regenerate
// Updated to match migrations 001–014

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'creator' | 'agency' | 'expert' | 'admin' | 'superadmin'
export type UserPlan = 'free' | 'starter' | 'pro' | 'agency' | 'enterprise'
export type ProjectStatus = 'active' | 'archived' | 'deleted'
export type InsightStatus = 'researching' | 'complete' | 'failed'
export type ManifestStatus = 'generating' | 'complete' | 'failed'
export type AssetStatus = 'draft' | 'generating' | 'in_review' | 'approved' | 'rejected' | 'archived'
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'
export type HireStatus = 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'completed' | 'disputed' | 'cancelled'
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused'

export interface Database {
  public: {
    Tables: {
      // ── User profiles ──────────────────────────────────────────────────────
      user_profiles: {
        Row: {
          id:          string
          email:       string
          name:        string | null
          role:        UserRole
          plan:        UserPlan
          credits:     number
          avatar_url:  string | null
          company:     string | null
          use_case:    string | null
          onboarded:   boolean
          status:      string
          created_at:  string
          updated_at:  string
        }
        Insert: {
          id:          string
          email:       string
          name?:       string | null
          role?:       UserRole
          plan?:       UserPlan
          credits?:    number
          avatar_url?: string | null
          company?:    string | null
          use_case?:   string | null
          onboarded?:  boolean
          status?:     string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?:       string | null
          role?:       UserRole
          plan?:       UserPlan
          credits?:    number
          avatar_url?: string | null
          company?:    string | null
          use_case?:   string | null
          onboarded?:  boolean
          status?:     string
          updated_at?: string
        }
      }
      // ── Projects ──────────────────────────────────────────────────────────
      projects: {
        Row: {
          id:            string
          user_id:       string
          name:          string
          description:   string | null
          brand:         string | null
          thumbnail_url: string | null
          status:        ProjectStatus
          created_at:    string
          updated_at:    string
        }
        Insert: {
          id?:           string
          user_id:       string
          name:          string
          description?:  string | null
          brand?:        string | null
          thumbnail_url?: string | null
          status?:       ProjectStatus
          created_at?:   string
          updated_at?:   string
        }
        Update: {
          name?:         string
          description?:  string | null
          brand?:        string | null
          thumbnail_url?: string | null
          status?:       ProjectStatus
          updated_at?:   string
        }
      }
      // ── Insight runs ──────────────────────────────────────────────────────
      insight_runs: {
        Row: {
          id:                     string
          project_id:             string
          user_id:                string
          subject:                string
          context:                string | null
          executive_summary:      string | null
          what_data_shows:        Json | null
          audience_signals:       Json | null
          competitive_landscape:  Json | null
          cultural_tension:       Json | null
          brand_archetype:        Json | null
          problem_statement:      string | null
          strategic_routes:       Json | null
          recommended_brief:      Json | null
          confidence_score:       number | null
          sources_searched:       number
          total_results:          number
          status:                 InsightStatus
          error_message:          string | null
          created_at:             string
          completed_at:           string | null
        }
        Insert: {
          id?:           string
          project_id:    string
          user_id:       string
          subject:       string
          context?:      string | null
          status?:       InsightStatus
          created_at?:   string
        }
        Update: {
          executive_summary?:     string | null
          what_data_shows?:       Json | null
          audience_signals?:      Json | null
          competitive_landscape?: Json | null
          cultural_tension?:      Json | null
          brand_archetype?:       Json | null
          problem_statement?:     string | null
          strategic_routes?:      Json | null
          recommended_brief?:     Json | null
          confidence_score?:      number | null
          sources_searched?:      number
          total_results?:         number
          status?:                InsightStatus
          error_message?:         string | null
          completed_at?:          string | null
        }
      }
      // ── Manifest runs ─────────────────────────────────────────────────────
      manifest_runs: {
        Row: {
          id:               string
          project_id:       string
          user_id:          string
          insight_run_id:   string | null
          input_type:       string | null
          custom_brief:     string | null
          output_type:      string | null
          title:            string | null
          sections:         Json
          scripts:          Json | null
          storyboard:       Json | null
          characters:       Json | null
          world_bible:      Json | null
          status:           ManifestStatus
          error_message:    string | null
          created_at:       string
          updated_at:       string
        }
        Insert: {
          id?:              string
          project_id:       string
          user_id:          string
          insight_run_id?:  string | null
          input_type?:      string | null
          custom_brief?:    string | null
          output_type?:     string | null
          title?:           string | null
          sections?:        Json
          status?:          ManifestStatus
          created_at?:      string
        }
        Update: {
          title?:           string | null
          sections?:        Json
          scripts?:         Json | null
          storyboard?:      Json | null
          characters?:      Json | null
          world_bible?:     Json | null
          status?:          ManifestStatus
          error_message?:   string | null
          updated_at?:      string
        }
      }
      // ── AI models ─────────────────────────────────────────────────────────
      ai_models: {
        Row: {
          id:               string
          name:             string
          provider:         string
          type:             string
          tier:             string
          description:      string | null
          capabilities:     Json
          aspect_ratios:    string[] | null
          tags:             string[] | null
          credits_per_unit: number
          is_active:        boolean
          is_recommended:   boolean
          is_new:           boolean
          sort_order:       number
          created_at:       string
        }
        Insert: {
          id:               string
          name:             string
          provider:         string
          type:             string
          tier?:            string
          description?:     string | null
          capabilities?:    Json
          credits_per_unit?: number
          is_active?:       boolean
          is_recommended?:  boolean
          is_new?:          boolean
          sort_order?:      number
        }
        Update: {
          name?:            string
          description?:     string | null
          capabilities?:    Json
          is_active?:       boolean
          is_recommended?:  boolean
          is_new?:          boolean
        }
      }
      // ── Craft assets ──────────────────────────────────────────────────────
      craft_assets: {
        Row: {
          id:                string
          project_id:        string
          user_id:           string
          manifest_run_id:   string | null
          scene_id:          string | null
          input_mode:        string | null
          type:              string
          url:               string | null
          thumbnail_url:     string | null
          file_size:         number | null
          duration_seconds:  number | null
          dimensions:        Json | null
          storage_path:      string | null
          model_id:          string | null
          prompt:            string | null
          negative_prompt:   string | null
          generation_params: Json | null
          fal_request_id:    string | null
          status:            AssetStatus
          review_notes:      string | null
          approved_by:       string | null
          approved_at:       string | null
          created_at:        string
        }
        Insert: {
          id?:               string
          project_id:        string
          user_id:           string
          manifest_run_id?:  string | null
          type:              string
          model_id?:         string | null
          prompt?:           string | null
          status?:           AssetStatus
          created_at?:       string
        }
        Update: {
          url?:              string | null
          thumbnail_url?:    string | null
          status?:           AssetStatus
          review_notes?:     string | null
          approved_by?:      string | null
          approved_at?:      string | null
          generation_params?: Json | null
          fal_request_id?:   string | null
        }
      }
      // ── Platform connections ───────────────────────────────────────────────
      platform_connections: {
        Row: {
          id:                  string
          user_id:             string
          platform:            string
          access_token:        string | null
          refresh_token:       string | null
          token_expires_at:    string | null
          platform_user_id:    string | null
          platform_username:   string | null
          is_active:           boolean
          created_at:          string
          updated_at:          string
        }
        Insert: {
          id?:                 string
          user_id:             string
          platform:            string
          access_token?:       string | null
          refresh_token?:      string | null
          token_expires_at?:   string | null
          platform_user_id?:   string | null
          platform_username?:  string | null
          is_active?:          boolean
        }
        Update: {
          access_token?:       string | null
          refresh_token?:      string | null
          token_expires_at?:   string | null
          platform_username?:  string | null
          is_active?:          boolean
          updated_at?:         string
        }
      }
      // ── Scheduled posts ───────────────────────────────────────────────────
      scheduled_posts: {
        Row: {
          id:                      string
          project_id:              string
          user_id:                 string
          asset_id:                string | null
          platform:                string
          caption:                 string | null
          hashtags:                string[] | null
          scheduled_at:            string | null
          published_at:            string | null
          performance_prediction:  Json | null
          actual_metrics:          Json | null
          status:                  PostStatus
          error_message:           string | null
          created_at:              string
          updated_at:              string
        }
        Insert: {
          id?:          string
          project_id:   string
          user_id:      string
          asset_id?:    string | null
          platform:     string
          caption?:     string | null
          hashtags?:    string[] | null
          scheduled_at?: string | null
          status?:      PostStatus
        }
        Update: {
          caption?:     string | null
          hashtags?:    string[] | null
          scheduled_at?: string | null
          published_at?: string | null
          actual_metrics?: Json | null
          status?:      PostStatus
          error_message?: string | null
          updated_at?:  string
        }
      }
      // ── Workspace graphs ──────────────────────────────────────────────────
      workspace_graphs: {
        Row: {
          id:         string
          project_id: string
          nodes:      Json
          edges:      Json
          viewport:   Json
          updated_at: string
        }
        Insert: {
          id?:        string
          project_id: string
          nodes?:     Json
          edges?:     Json
          viewport?:  Json
        }
        Update: {
          nodes?:     Json
          edges?:     Json
          viewport?:  Json
          updated_at?: string
        }
      }
      // ── Experts ───────────────────────────────────────────────────────────
      experts: {
        Row: {
          id:                   string
          user_id:              string | null
          name:                 string
          title:                string | null
          bio:                  string | null
          avatar_url:           string | null
          portfolio_urls:       string[] | null
          minimum_budget:       number
          response_time_hours:  number
          is_available:         boolean
          is_verified:          boolean
          total_projects:       number
          average_rating:       number
          stripe_account_id:    string | null
          created_at:           string
          updated_at:           string
        }
        Insert: {
          id?:                  string
          user_id?:             string | null
          name:                 string
          title?:               string | null
          bio?:                 string | null
          is_available?:        boolean
          minimum_budget?:      number
          response_time_hours?: number
        }
        Update: {
          name?:                string
          title?:               string | null
          bio?:                 string | null
          avatar_url?:          string | null
          portfolio_urls?:      string[] | null
          minimum_budget?:      number
          response_time_hours?: number
          is_available?:        boolean
          stripe_account_id?:   string | null
          updated_at?:          string
        }
      }
      // ── Expert skills ─────────────────────────────────────────────────────
      expert_skills: {
        Row:    { expert_id: string; skill_id: string; proficiency: number }
        Insert: { expert_id: string; skill_id: string; proficiency?: number }
        Update: { proficiency?: number }
      }
      // ── Hire requests ─────────────────────────────────────────────────────
      hire_requests: {
        Row: {
          id:                 string
          client_id:          string
          expert_id:          string
          project_id:         string | null
          module:             string | null
          task_description:   string | null
          deliverable:        string | null
          deadline:           string | null
          budget_credits:     number
          status:             HireStatus
          delivery_notes:     string | null
          delivery_urls:      string[] | null
          rating:             number | null
          review_text:        string | null
          reviewed_at:        string | null
          created_at:         string
          updated_at:         string
        }
        Insert: {
          id?:                string
          client_id:          string
          expert_id:          string
          project_id?:        string | null
          module?:            string | null
          task_description?:  string | null
          deliverable?:       string | null
          deadline?:          string | null
          budget_credits?:    number
          status?:            HireStatus
        }
        Update: {
          status?:            HireStatus
          delivery_notes?:    string | null
          delivery_urls?:     string[] | null
          rating?:            number | null
          review_text?:       string | null
          reviewed_at?:       string | null
          updated_at?:        string
        }
      }
      // ── User subscriptions ────────────────────────────────────────────────
      user_subscriptions: {
        Row: {
          id:                      string
          user_id:                 string
          stripe_customer_id:      string | null
          stripe_subscription_id:  string | null
          plan:                    UserPlan
          status:                  SubscriptionStatus
          current_period_start:    string | null
          current_period_end:      string | null
          trial_ends_at:           string | null
          canceled_at:             string | null
          generation_credits:      number
          credits_reset_at:        string | null
          created_at:              string
          updated_at:              string
        }
        Insert: {
          id?:                     string
          user_id:                 string
          stripe_customer_id?:     string | null
          plan?:                   UserPlan
          status?:                 SubscriptionStatus
          generation_credits?:     number
        }
        Update: {
          stripe_customer_id?:     string | null
          stripe_subscription_id?: string | null
          plan?:                   UserPlan
          status?:                 SubscriptionStatus
          current_period_start?:   string | null
          current_period_end?:     string | null
          trial_ends_at?:          string | null
          canceled_at?:            string | null
          generation_credits?:     number
          credits_reset_at?:       string | null
          updated_at?:             string
        }
      }
      // ── AI usage log ──────────────────────────────────────────────────────
      ai_usage_log: {
        Row: {
          id:            string
          user_id:       string | null
          project_id:    string | null
          module:        string | null
          operation:     string
          model_id:      string | null
          provider:      string | null
          tokens_in:     number
          tokens_out:    number
          credits_used:  number
          cost_usd:      number | null
          latency_ms:    number | null
          status:        string
          error_message: string | null
          request_id:    string | null
          metadata:      Json | null
          created_at:    string
        }
        Insert: {
          user_id?:      string | null
          project_id?:   string | null
          module?:       string | null
          operation:     string
          model_id?:     string | null
          provider?:     string | null
          tokens_in?:    number
          tokens_out?:   number
          credits_used?: number
          cost_usd?:     number | null
          latency_ms?:   number | null
          status:        string
          error_message?: string | null
          request_id?:   string | null
          metadata?:     Json | null
        }
        Update: Record<string, never>
      }
      // ── System prompts ────────────────────────────────────────────────────
      system_prompts: {
        Row: {
          id:          string
          module:      string | null
          name:        string
          description: string | null
          content:     string
          temperature: number
          max_tokens:  number
          model:       string
          is_active:   boolean
          version:     number
          updated_by:  string | null
          updated_at:  string
        }
        Insert: {
          id:          string
          module?:     string | null
          name:        string
          content:     string
          temperature?: number
          max_tokens?:  number
          model?:      string
          is_active?:  boolean
        }
        Update: {
          content?:     string
          temperature?: number
          max_tokens?:  number
          model?:       string
          is_active?:   boolean
          updated_by?:  string | null
          updated_at?:  string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_generation_credit: {
        Args: { p_user_id: string; p_amount?: number }
        Returns: boolean
      }
      add_generation_credits: {
        Args: { p_user_id: string; p_amount: number }
        Returns: number
      }
      get_user_stats: {
        Args: { p_user_id: string }
        Returns: Json
      }
      can_access_module: {
        Args: { p_user_id: string; p_module: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

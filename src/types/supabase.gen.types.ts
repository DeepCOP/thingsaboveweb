export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      ai_daily_messages: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          message_date: string;
          type: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          message_date: string;
          type: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          message_date?: string;
          type?: string;
        };
        Relationships: [];
      };
      ai_notifications: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          message_id: string | null;
          scheduled_for: string | null;
          sent_at: string | null;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          message_id?: string | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          message_id?: string | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_notifications_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'ai_daily_messages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ai_notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ai_notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
        ];
      };
      ai_triggers: {
        Row: {
          context: Json;
          created_at: string | null;
          generated_message: string | null;
          generated_title: string | null;
          id: string;
          planner_payload: Json;
          planner_reason: string | null;
          planning_model: string | null;
          priority: number | null;
          scheduled_for: string | null;
          sent: boolean | null;
          sent_at: string | null;
          trigger_reason: string;
          user_id: string;
        };
        Insert: {
          context?: Json;
          created_at?: string | null;
          generated_message?: string | null;
          generated_title?: string | null;
          id?: string;
          planner_payload?: Json;
          planner_reason?: string | null;
          planning_model?: string | null;
          priority?: number | null;
          scheduled_for?: string | null;
          sent?: boolean | null;
          sent_at?: string | null;
          trigger_reason: string;
          user_id: string;
        };
        Update: {
          context?: Json;
          created_at?: string | null;
          generated_message?: string | null;
          generated_title?: string | null;
          id?: string;
          planner_payload?: Json;
          planner_reason?: string | null;
          planning_model?: string | null;
          priority?: number | null;
          scheduled_for?: string | null;
          sent?: boolean | null;
          sent_at?: string | null;
          trigger_reason?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_triggers_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ai_triggers_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
        ];
      };
      churches: {
        Row: {
          address: string | null;
          created_at: string;
          id: string;
          name: string;
          normalized_address: string | null;
          normalized_name: string | null;
          normalized_website_url: string | null;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          normalized_address?: string | null;
          normalized_name?: string | null;
          normalized_website_url?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          normalized_address?: string | null;
          normalized_name?: string | null;
          normalized_website_url?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          content: string;
          created_at: string | null;
          day_id: string;
          group_id: string;
          id: string;
          plan_id: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          day_id: string;
          group_id: string;
          id?: string;
          plan_id: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          day_id?: string;
          group_id?: string;
          id?: string;
          plan_id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_day_id_fkey';
            columns: ['day_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_days';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'plan_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
        ];
      };
      day_items_progress: {
        Row: {
          completed: boolean | null;
          created_at: string | null;
          day_id: string | null;
          day_number: number | null;
          devotional_content: string | null;
          group_id: string | null;
          id: string;
          item_key: string | null;
          item_type: string | null;
          plan_id: string | null;
          progress_id: string | null;
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          completed?: boolean | null;
          created_at?: string | null;
          day_id?: string | null;
          day_number?: number | null;
          devotional_content?: string | null;
          group_id?: string | null;
          id?: string;
          item_key?: string | null;
          item_type?: string | null;
          plan_id?: string | null;
          progress_id?: string | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          completed?: boolean | null;
          created_at?: string | null;
          day_id?: string | null;
          day_number?: number | null;
          devotional_content?: string | null;
          group_id?: string | null;
          id?: string;
          item_key?: string | null;
          item_type?: string | null;
          plan_id?: string | null;
          progress_id?: string | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'day_items_progress_day_id_fkey';
            columns: ['day_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_days';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'day_items_progress_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'plan_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'day_items_progress_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'day_items_progress_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'day_items_progress_progress_id_fkey';
            columns: ['progress_id'];
            isOneToOne: false;
            referencedRelation: 'plan_progress';
            referencedColumns: ['id'];
          },
        ];
      };
      devotional_days: {
        Row: {
          content: string;
          created_at: string | null;
          day_number: number;
          id: string;
          plan_id: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          day_number: number;
          id?: string;
          plan_id?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          day_number?: number;
          id?: string;
          plan_id?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'devotional_days_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'devotional_days_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
        ];
      };
      devotional_days_draft: {
        Row: {
          content: string;
          created_at: string | null;
          day_number: number;
          id: string;
          plan_id: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          day_number: number;
          id?: string;
          plan_id?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          day_number?: number;
          id?: string;
          plan_id?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'devotional_days_draft_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'devotional_days_draft_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
        ];
      };
      devotional_plans: {
        Row: {
          author_id: string | null;
          completions: number | null;
          cover_image: string | null;
          created_at: string | null;
          description: string;
          id: string;
          status: string | null;
          tags: string[] | null;
          title: string;
          total_days: number;
          updated_at: string | null;
        };
        Insert: {
          author_id?: string | null;
          completions?: number | null;
          cover_image?: string | null;
          created_at?: string | null;
          description: string;
          id?: string;
          status?: string | null;
          tags?: string[] | null;
          title: string;
          total_days?: number;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string | null;
          completions?: number | null;
          cover_image?: string | null;
          created_at?: string | null;
          description?: string;
          id?: string;
          status?: string | null;
          tags?: string[] | null;
          title?: string;
          total_days?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      friends: {
        Row: {
          created_at: string | null;
          id: string;
          receiver_id: string;
          requester_id: string;
          status: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          receiver_id: string;
          requester_id: string;
          status: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          receiver_id?: string;
          requester_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'friends_receiver_id_fkey';
            columns: ['receiver_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friends_receiver_id_fkey';
            columns: ['receiver_id'];
            isOneToOne: false;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'friends_requester_id_fkey';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friends_requester_id_fkey';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
        ];
      };
      notification_preferences: {
        Row: {
          created_at: string | null;
          daily: boolean | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          daily?: boolean | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          daily?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notification_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string | null;
          data: Json | null;
          id: string;
          is_read: boolean | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          is_read?: boolean | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          is_read?: boolean | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
        ];
      };
      plan_group_members: {
        Row: {
          group_id: string;
          id: string;
          joined_at: string | null;
          status: string | null;
          user_id: string;
        };
        Insert: {
          group_id: string;
          id?: string;
          joined_at?: string | null;
          status?: string | null;
          user_id: string;
        };
        Update: {
          group_id?: string;
          id?: string;
          joined_at?: string | null;
          status?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'plan_group_members_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'plan_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plan_group_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plan_group_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
        ];
      };
      plan_groups: {
        Row: {
          completed_days: number | null;
          created_at: string | null;
          created_by: string;
          id: string;
          max_members: number | null;
          plan_id: string;
          start_date: string;
        };
        Insert: {
          completed_days?: number | null;
          created_at?: string | null;
          created_by: string;
          id?: string;
          max_members?: number | null;
          plan_id: string;
          start_date: string;
        };
        Update: {
          completed_days?: number | null;
          created_at?: string | null;
          created_by?: string;
          id?: string;
          max_members?: number | null;
          plan_id?: string;
          start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'plan_groups_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plan_groups_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'plan_groups_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plan_groups_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
        ];
      };
      plan_progress: {
        Row: {
          completed_days: number[] | null;
          completed_once: boolean | null;
          created_at: string | null;
          current_day: number;
          group_id: string | null;
          id: string;
          plan_id: string | null;
          start_date: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          completed_days?: number[] | null;
          completed_once?: boolean | null;
          created_at?: string | null;
          current_day?: number;
          group_id?: string | null;
          id?: string;
          plan_id?: string | null;
          start_date?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          completed_days?: number[] | null;
          completed_once?: boolean | null;
          created_at?: string | null;
          current_day?: number;
          group_id?: string | null;
          id?: string;
          plan_id?: string | null;
          start_date?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'plan_progress_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'plan_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plan_progress_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plan_progress_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
        ];
      };
      plan_ratings: {
        Row: {
          created_at: string;
          id: string;
          plan_id: string;
          rating: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          plan_id: string;
          rating: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          plan_id?: string;
          rating?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'plan_ratings_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plan_ratings_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
        ];
      };
      plan_reactions: {
        Row: {
          created_at: string | null;
          id: string;
          plan_id: string | null;
          reaction_type: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          plan_id?: string | null;
          reaction_type?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          plan_id?: string | null;
          reaction_type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'plan_reactions_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plan_reactions_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          church_id: string | null;
          created_at: string | null;
          email: string;
          expo_push_token: string | null;
          first_name: string;
          id: string;
          last_name: string;
          last_seen: string | null;
          timezone: string | null;
          updated_at: string | null;
          year_baptized: number | null;
          year_believed: number | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          church_id?: string | null;
          created_at?: string | null;
          email: string;
          expo_push_token?: string | null;
          first_name: string;
          id: string;
          last_name: string;
          last_seen?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          year_baptized?: number | null;
          year_believed?: number | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          church_id?: string | null;
          created_at?: string | null;
          email?: string;
          expo_push_token?: string | null;
          first_name?: string;
          id?: string;
          last_name?: string;
          last_seen?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          year_baptized?: number | null;
          year_believed?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_church_id_fkey';
            columns: ['church_id'];
            isOneToOne: false;
            referencedRelation: 'churches';
            referencedColumns: ['id'];
          },
        ];
      };
      reports: {
        Row: {
          created_at: string | null;
          id: string;
          plan_id: string | null;
          reason: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          plan_id?: string | null;
          reason: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          plan_id?: string | null;
          reason?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
        ];
      };
      saved_plans: {
        Row: {
          created_at: string | null;
          id: string;
          plan_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          plan_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          plan_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'saved_plans_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'saved_plans_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_plans_view';
            referencedColumns: ['id'];
          },
        ];
      };
      scripture_note_helpful_votes: {
        Row: {
          created_at: string;
          note_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          note_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          note_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'scripture_note_helpful_votes_note_id_fkey';
            columns: ['note_id'];
            isOneToOne: false;
            referencedRelation: 'scripture_notes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scripture_note_helpful_votes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scripture_note_helpful_votes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
        ];
      };
      scripture_notes: {
        Row: {
          book: string;
          chapter: number | null;
          content: string;
          created_at: string;
          id: string;
          note_type: string;
          parent_note_id: string | null;
          scope_key: string;
          updated_at: string;
          user_id: string;
          verse_end: number | null;
          verse_start: number | null;
        };
        Insert: {
          book: string;
          chapter?: number | null;
          content: string;
          created_at?: string;
          id?: string;
          note_type: string;
          parent_note_id?: string | null;
          scope_key: string;
          updated_at?: string;
          user_id: string;
          verse_end?: number | null;
          verse_start?: number | null;
        };
        Update: {
          book?: string;
          chapter?: number | null;
          content?: string;
          created_at?: string;
          id?: string;
          note_type?: string;
          parent_note_id?: string | null;
          scope_key?: string;
          updated_at?: string;
          user_id?: string;
          verse_end?: number | null;
          verse_start?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'scripture_notes_parent_note_id_fkey';
            columns: ['parent_note_id'];
            isOneToOne: false;
            referencedRelation: 'scripture_notes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scripture_notes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scripture_notes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_behavior_snapshot';
            referencedColumns: ['user_id'];
          },
        ];
      };
      scripture_references: {
        Row: {
          created_at: string | null;
          day_id: string | null;
          id: string;
          reference: string[] | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          day_id?: string | null;
          id?: string;
          reference?: string[] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          day_id?: string | null;
          id?: string;
          reference?: string[] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'scripture_references_day_id_fkey';
            columns: ['day_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_days';
            referencedColumns: ['id'];
          },
        ];
      };
      scripture_references_draft: {
        Row: {
          created_at: string | null;
          day_id: string | null;
          id: string;
          reference: string[] | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          day_id?: string | null;
          id?: string;
          reference?: string[] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          day_id?: string | null;
          id?: string;
          reference?: string[] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'scripture_references_draft_day_id_fkey';
            columns: ['day_id'];
            isOneToOne: false;
            referencedRelation: 'devotional_days_draft';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      devotional_plans_view: {
        Row: {
          author_id: string | null;
          completions: number | null;
          cover_image: string | null;
          created_at: string | null;
          description: string | null;
          helpful_count: number | null;
          id: string | null;
          rating_avg: number | null;
          rating_count: number | null;
          status: string | null;
          tags: string[] | null;
          title: string | null;
          total_days: number | null;
          updated_at: string | null;
          user_reaction: string | null;
        };
        Insert: {
          author_id?: string | null;
          completions?: number | null;
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          helpful_count?: never;
          id?: string | null;
          rating_avg?: never;
          rating_count?: never;
          status?: string | null;
          tags?: string[] | null;
          title?: string | null;
          total_days?: number | null;
          updated_at?: string | null;
          user_reaction?: never;
        };
        Update: {
          author_id?: string | null;
          completions?: number | null;
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          helpful_count?: never;
          id?: string | null;
          rating_avg?: never;
          rating_count?: never;
          status?: string | null;
          tags?: string[] | null;
          title?: string | null;
          total_days?: number | null;
          updated_at?: string | null;
          user_reaction?: never;
        };
        Relationships: [];
      };
      user_behavior_snapshot: {
        Row: {
          abandoned_plans: number | null;
          active_plans: number | null;
          commented_recently: boolean | null;
          has_friends: boolean | null;
          has_group_plan: boolean | null;
          last_activity_at: string | null;
          last_seen: string | null;
          max_days_completed: number | null;
          plans_completed: number | null;
          plans_started: number | null;
          time_since_last_activity: string | null;
          time_since_last_seen: string | null;
          timezone: string | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      accept_friend_request: {
        Args: { p_requester_id: string };
        Returns: undefined;
      };
      accept_plan_group_invite: {
        Args: { p_group_id: string; p_plan_id: string; p_start_date: string };
        Returns: {
          completed_days: number[] | null;
          completed_once: boolean | null;
          created_at: string | null;
          current_day: number;
          group_id: string | null;
          id: string;
          plan_id: string | null;
          start_date: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        SetofOptions: {
          from: '*';
          to: 'plan_progress';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      add_plan_day_comment: {
        Args: {
          p_content: string;
          p_day_id: string;
          p_group_id?: string;
          p_plan_id: string;
        };
        Returns: undefined;
      };
      add_scripture_note: {
        Args: {
          p_book: string;
          p_chapter?: number;
          p_content?: string;
          p_note_type: string;
          p_parent_note_id?: string;
          p_scope_key: string;
          p_verse_end?: number;
          p_verse_start?: number;
        };
        Returns: string;
      };
      add_user_to_existing_plan_group: {
        Args: { p_friends_ids: string[]; p_group_id: string };
        Returns: undefined;
      };
      create_notification: {
        Args: {
          p_body: string;
          p_data?: Json;
          p_title: string;
          p_type: string;
          p_user_ids: string[];
        };
        Returns: undefined;
      };
      create_plan_group: {
        Args: {
          p_friends_ids: string[];
          p_plan_id: string;
          p_start_date: string;
          p_user_id: string;
        };
        Returns: {
          completed_days: number[] | null;
          completed_once: boolean | null;
          created_at: string | null;
          current_day: number;
          group_id: string | null;
          id: string;
          plan_id: string | null;
          start_date: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        SetofOptions: {
          from: '*';
          to: 'plan_progress';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      decline_friend_request: {
        Args: { p_requester_id: string };
        Returns: undefined;
      };
      plan_tags: { Args: never; Returns: string[] };
      ensure_day_items_exist: {
        Args: {
          p_day_id: string;
          p_group_id?: string;
          p_plan_id: string;
          p_progress_id: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      find_or_create_church: {
        Args: { p_address?: string; p_name?: string; p_website_url?: string };
        Returns: string;
      };
      get_day_items_progress: {
        Args: {
          p_day_id: string;
          p_group_id?: string;
          p_plan_id: string;
          p_progress_id: string;
          p_user_id: string;
        };
        Returns: {
          completed: boolean | null;
          created_at: string | null;
          day_id: string | null;
          day_number: number | null;
          devotional_content: string | null;
          group_id: string | null;
          id: string;
          item_key: string | null;
          item_type: string | null;
          plan_id: string | null;
          progress_id: string | null;
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        }[];
        SetofOptions: {
          from: '*';
          to: 'day_items_progress';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_devotional_days_with_scriptures: {
        Args: { p_plan_id: string };
        Returns: {
          content: string;
          day_id: string;
          day_number: number;
          scriptures: string[];
          title: string;
        }[];
      };
      get_devotional_drafts: {
        Args: { _plan_id: string };
        Returns: {
          content: string;
          day_id: string;
          day_number: number;
          scriptures: string[];
          title: string;
        }[];
      };
      get_my_devotional_plans: {
        Args: never;
        Returns: {
          cover_image: string;
          created_at: string;
          description: string;
          helpful_count: number;
          id: string;
          status: string;
          title: string;
          total_days: number;
        }[];
      };
      get_my_notifications: {
        Args: never;
        Returns: {
          body: string;
          created_at: string;
          data: Json;
          id: string;
          is_read: boolean;
          title: string;
          type: string;
        }[];
      };
      get_my_plan_progress_plans: {
        Args: never;
        Returns: {
          author_id: string;
          completed_days: number;
          completed_once: boolean;
          completions: number;
          cover_image: string;
          created_at: string;
          description: string;
          group_id: string;
          helpful_count: number;
          id: string;
          progress_id: string;
          rating_avg: number;
          rating_count: number;
          started_at: string;
          status: string;
          tags: string[];
          title: string;
          total_days: number;
          updated_at: string;
          user_reaction: string;
        }[];
      };
      get_my_plan_rating: { Args: { p_plan_id: string }; Returns: number };
      get_my_saved_plans: {
        Args: never;
        Returns: {
          author_id: string;
          completions: number;
          cover_image: string;
          created_at: string;
          description: string;
          helpful_count: number;
          id: string;
          rating_avg: number;
          rating_count: number;
          saved_at: string;
          status: string;
          tags: string[];
          title: string;
          total_days: number;
          updated_at: string;
          user_reaction: string;
        }[];
      };
      get_pending_friend_requests: {
        Args: never;
        Returns: {
          avatar_url: string;
          created_at: string;
          first_name: string;
          id: string;
          last_name: string;
          requester_id: string;
        }[];
      };
      get_plan_day_comments: {
        Args: { p_day_id: string; p_group_id?: string; p_plan_id: string };
        Returns: {
          avatar_url: string;
          content: string;
          created_at: string;
          first_name: string;
          group_id: string;
          id: string;
          last_name: string;
          user_id: string;
        }[];
      };
      get_plan_reaction_summary: {
        Args: { p_plan_id: string };
        Returns: {
          helpful_count: number;
          user_reaction: string;
        }[];
      };
      get_scripture_notes: {
        Args: {
          p_limit?: number;
          p_note_type: string;
          p_offset?: number;
          p_scope_key: string;
        };
        Returns: {
          avatar_url: string;
          book: string;
          chapter: number;
          content: string;
          created_at: string;
          first_name: string;
          helpful_count: number;
          id: string;
          is_helpful: boolean;
          last_name: string;
          note_type: string;
          parent_note_id: string;
          scope_key: string;
          updated_at: string;
          user_id: string;
          verse_end: number;
          verse_start: number;
        }[];
      };
      get_user_by_email: {
        Args: { p_email: string };
        Returns: {
          avatar_url: string;
          email: string;
          first_name: string;
          friendship_status: string;
          id: string;
          last_name: string;
          receiver_id: string;
          requester_id: string;
        }[];
      };
      is_group_member: { Args: { p_group_id: string }; Returns: boolean };
      mark_notification_read: {
        Args: { p_notification_id: string };
        Returns: undefined;
      };
      normalize_church_text: { Args: { p_value: string }; Returns: string };
      normalize_church_website_url: {
        Args: { p_value: string };
        Returns: string;
      };
      publish_devotional_plan: {
        Args: { p_days: Json; p_plan_id: string };
        Returns: undefined;
      };
      queue_daily_notifications: { Args: never; Returns: undefined };
      report_plan: {
        Args: { p_plan_id: string; p_reason: string };
        Returns: undefined;
      };
      save_devotional_draft: {
        Args: { _days: Json; _plan_id: string };
        Returns: undefined;
      };
      save_signup_about_details: {
        Args: {
          p_church_address?: string;
          p_church_id?: string;
          p_church_name?: string;
          p_church_website_url?: string;
          p_clear_church?: boolean;
          p_email: string;
          p_user_id: string;
          p_year_baptized?: number;
          p_year_believed?: number;
        };
        Returns: undefined;
      };
      search_plans: {
        Args: {
          cursor_created_at?: string;
          cursor_id?: string;
          limit_count?: number;
          search_query: string;
        };
        Returns: {
          author_id: string | null;
          completions: number | null;
          cover_image: string | null;
          created_at: string | null;
          description: string | null;
          helpful_count: number | null;
          id: string | null;
          rating_avg: number | null;
          rating_count: number | null;
          status: string | null;
          tags: string[] | null;
          title: string | null;
          total_days: number | null;
          updated_at: string | null;
          user_reaction: string | null;
        }[];
        SetofOptions: {
          from: '*';
          to: 'devotional_plans_view';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      send_friend_request: {
        Args: { p_receiver_id: string };
        Returns: undefined;
      };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { '': string }; Returns: string[] };
      start_plan_progress: {
        Args: {
          p_group_id?: string;
          p_plan_id: string;
          p_start_date?: string;
          p_user_id: string;
        };
        Returns: {
          completed_days: number[] | null;
          completed_once: boolean | null;
          created_at: string | null;
          current_day: number;
          group_id: string | null;
          id: string;
          plan_id: string | null;
          start_date: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        SetofOptions: {
          from: '*';
          to: 'plan_progress';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      tags_to_text: { Args: { tags: string[] }; Returns: string };
      toggle_day_completion: {
        Args: {
          p_completed: boolean;
          p_day_id: string;
          p_group_id?: string;
          p_plan_id: string;
          p_progress_id: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      toggle_item_completion: {
        Args: {
          p_completed: boolean;
          p_day_id: string;
          p_group_id?: string;
          p_item_key: string;
          p_item_type: string;
          p_plan_id: string;
          p_progress_id: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      toggle_reaction: {
        Args: { p_plan_id: string; p_reaction_type: string };
        Returns: string;
      };
      toggle_scripture_note_helpful: {
        Args: { p_note_id: string };
        Returns: {
          helpful_count: number;
          is_helpful: boolean;
        }[];
      };
      unread_notifications_count: { Args: never; Returns: number };
      update_profile:
        | {
            Args: {
              p_avatar_url?: string;
              p_bio?: string;
              p_first_name?: string;
              p_last_name?: string;
            };
            Returns: undefined;
          }
        | {
            Args: {
              p_avatar_url?: string;
              p_bio?: string;
              p_church_address?: string;
              p_church_id?: string;
              p_church_name?: string;
              p_church_website_url?: string;
              p_clear_church?: boolean;
              p_first_name?: string;
              p_last_name?: string;
              p_year_baptized?: number;
              p_year_believed?: number;
            };
            Returns: undefined;
          };
      upsert_plan_rating: {
        Args: { p_plan_id: string; p_rating: number };
        Returns: undefined;
      };
      upsert_push_notification_setup: {
        Args: { p_expo_push_token: string; p_timezone: string };
        Returns: undefined;
      };
      user_has_active_auth_session: {
        Args: { p_user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

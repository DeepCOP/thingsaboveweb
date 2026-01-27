export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
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
          tags: string | null;
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
          tags?: string | null;
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
          tags?: string | null;
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
            foreignKeyName: 'friends_requester_id_fkey';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
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
          created_at: string | null;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
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
          dislikes_count: number | null;
          id: string | null;
          likes_count: number | null;
          tags: string | null;
          title: string | null;
          total_days: number | null;
          updated_at: string | null;
        };
        Insert: {
          author_id?: string | null;
          completions?: number | null;
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          dislikes_count?: never;
          id?: string | null;
          likes_count?: never;
          tags?: string | null;
          title?: string | null;
          total_days?: number | null;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string | null;
          completions?: number | null;
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          dislikes_count?: never;
          id?: string | null;
          likes_count?: never;
          tags?: string | null;
          title?: string | null;
          total_days?: number | null;
          updated_at?: string | null;
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
        Returns: string;
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
        Returns: string;
      };
      decline_friend_request: {
        Args: { p_requester_id: string };
        Returns: undefined;
      };
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
          dislikes_count: number;
          id: string;
          likes_count: number;
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
          dislikes: number;
          likes: number;
          user_reaction: string;
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
        }[];
      };
      is_group_member: { Args: { p_group_id: string }; Returns: boolean };
      mark_notification_read: {
        Args: { p_notification_id: string };
        Returns: undefined;
      };
      publish_devotional_plan: {
        Args: { p_days: Json; p_plan_id: string };
        Returns: undefined;
      };
      report_plan: {
        Args: { p_plan_id: string; p_reason: string };
        Returns: undefined;
      };
      save_devotional_draft: {
        Args: { _days: Json; _plan_id: string };
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
          dislikes_count: number | null;
          id: string | null;
          likes_count: number | null;
          tags: string | null;
          title: string | null;
          total_days: number | null;
          updated_at: string | null;
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
        Returns: string;
      };
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
      unread_notifications_count: { Args: never; Returns: number };
      update_profile: {
        Args: {
          p_avatar_url?: string;
          p_bio?: string;
          p_first_name?: string;
          p_last_name?: string;
        };
        Returns: undefined;
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

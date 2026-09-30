export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      content: {
        Row: {
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          published_at: string
          read_time: number
          source_id: string | null
          title: string
          topics: string[]
          url: string
        }
        Insert: {
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          published_at?: string
          read_time?: number
          source_id?: string | null
          title: string
          topics?: string[]
          url: string
        }
        Update: {
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          published_at?: string
          read_time?: number
          source_id?: string | null
          title?: string
          topics?: string[]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      dad_groups: {
        Row: {
          category: string
          city: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          member_count: number
          name: string
          state: string | null
          topics: string[]
          updated_at: string
          visibility: string
        }
        Insert: {
          category: string
          city?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          member_count?: number
          name: string
          state?: string | null
          topics?: string[]
          updated_at?: string
          visibility?: string
        }
        Update: {
          category?: string
          city?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          member_count?: number
          name?: string
          state?: string | null
          topics?: string[]
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "dad_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dad_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          author_id: string
          content: string
          created_at: string
          group_id: string
          id: string
          message_type: string
          metadata: Json | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          group_id: string
          id?: string
          message_type?: string
          metadata?: Json | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          message_type?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dad_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      meetup_attendees: {
        Row: {
          joined_at: string
          meetup_id: string
          status: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          meetup_id: string
          status?: string
          user_id: string
        }
        Update: {
          joined_at?: string
          meetup_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetup_attendees_meetup_id_fkey"
            columns: ["meetup_id"]
            isOneToOne: false
            referencedRelation: "meetups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetup_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meetups: {
        Row: {
          activity_type: string
          address: string | null
          city: string | null
          created_at: string
          created_by: string
          current_attendees: number
          description: string | null
          end_time: string | null
          group_id: string | null
          id: string
          location: string | null
          max_attendees: number | null
          start_time: string
          state: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          activity_type: string
          address?: string | null
          city?: string | null
          created_at?: string
          created_by: string
          current_attendees?: number
          description?: string | null
          end_time?: string | null
          group_id?: string | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          start_time: string
          state?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          activity_type?: string
          address?: string | null
          city?: string | null
          created_at?: string
          created_by?: string
          current_attendees?: number
          description?: string | null
          end_time?: string | null
          group_id?: string | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          start_time?: string
          state?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dad_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_private: {
        Row: {
          city: string | null
          city_opt_in: boolean
          kids_ages: string[]
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          city_opt_in?: boolean
          kids_ages?: string[]
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          city_opt_in?: boolean
          kids_ages?: string[]
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_private_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          city_opt_in: boolean
          created_at: string
          id: string
          interests: string[]
          kids_ages: string[]
          name: string
          state: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          city_opt_in?: boolean
          created_at?: string
          id: string
          interests?: string[]
          kids_ages?: string[]
          name: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          city_opt_in?: boolean
          created_at?: string
          id?: string
          interests?: string[]
          kids_ages?: string[]
          name?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saves: {
        Row: {
          content_id: string
          id: string
          note: string | null
          read_status: string
          ts: string
          user_id: string
        }
        Insert: {
          content_id: string
          id?: string
          note?: string | null
          read_status?: string
          ts?: string
          user_id: string
        }
        Update: {
          content_id?: string
          id?: string
          note?: string | null
          read_status?: string
          ts?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saves_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          created_at: string
          id: string
          name: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          url?: string | null
        }
        Relationships: []
      }
      threads: {
        Row: {
          author_id: string
          body: string
          group_id: string
          id: string
          reactions: Json
          title: string
          ts: string
        }
        Insert: {
          author_id: string
          body: string
          group_id: string
          id?: string
          reactions?: Json
          title: string
          ts?: string
        }
        Update: {
          author_id?: string
          body?: string
          group_id?: string
          id?: string
          reactions?: Json
          title?: string
          ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dad_groups"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

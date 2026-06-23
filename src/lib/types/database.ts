export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      couples: {
        Row: {
          id: string;
          invite_code: string;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          invite_code: string;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          invite_code?: string;
          created_at?: string;
          created_by?: string;
        };
      };
      couple_members: {
        Row: {
          couple_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          couple_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          couple_id?: string;
          user_id?: string;
          joined_at?: string;
        };
      };
      quiz_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          is_custom: boolean;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          is_custom?: boolean;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          is_custom?: boolean;
          created_by?: string | null;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          category_id: string;
          mode: string;
          question: string;
          options: Json | null;
          correct_answer: string | null;
          difficulty: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          mode: string;
          question: string;
          options?: Json | null;
          correct_answer?: string | null;
          difficulty?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          mode?: string;
          question?: string;
          options?: Json | null;
          correct_answer?: string | null;
          difficulty?: string;
          created_by?: string | null;
          created_at?: string;
        };
      };
      quiz_sessions: {
        Row: {
          id: string;
          couple_id: string;
          category_id: string | null;
          mode: string;
          status: string;
          current_question_index: number;
          scores: Json;
          created_by: string;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          couple_id: string;
          category_id?: string | null;
          mode: string;
          status?: string;
          current_question_index?: number;
          scores?: Json;
          created_by: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          couple_id?: string;
          category_id?: string | null;
          mode?: string;
          status?: string;
          current_question_index?: number;
          scores?: Json;
          created_by?: string;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      quiz_responses: {
        Row: {
          id: string;
          session_id: string;
          question_id: string;
          user_id: string;
          answer: string;
          is_correct: boolean | null;
          answered_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_id: string;
          user_id: string;
          answer: string;
          is_correct?: boolean | null;
          answered_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          question_id?: string;
          user_id?: string;
          answer?: string;
          is_correct?: boolean | null;
          answered_at?: string;
        };
      };
      listen_sessions: {
        Row: {
          id: string;
          couple_id: string;
          status: string;
          current_track_id: string | null;
          current_ambient_id: string | null;
          progress_ms: number;
          queue: Json;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          status?: string;
          current_track_id?: string | null;
          current_ambient_id?: string | null;
          progress_ms?: number;
          queue?: Json;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          status?: string;
          current_track_id?: string | null;
          current_ambient_id?: string | null;
          progress_ms?: number;
          queue?: Json;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      focus_sessions: {
        Row: {
          id: string;
          couple_id: string;
          status: string;
          focus_duration: number;
          break_duration: number;
          long_break_duration: number;
          sessions_before_long_break: number;
          current_session: number;
          started_at: string | null;
          paused_at: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          status?: string;
          focus_duration?: number;
          break_duration?: number;
          long_break_duration?: number;
          sessions_before_long_break?: number;
          current_session?: number;
          started_at?: string | null;
          paused_at?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          status?: string;
          focus_duration?: number;
          break_duration?: number;
          long_break_duration?: number;
          sessions_before_long_break?: number;
          current_session?: number;
          started_at?: string | null;
          paused_at?: string | null;
          created_by?: string;
          created_at?: string;
        };
      };
      focus_participants: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          status: string;
          task: string | null;
          goal: string | null;
          daily_goal_minutes: number;
          focus_minutes_today: number;
          joined_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          status?: string;
          task?: string | null;
          goal?: string | null;
          daily_goal_minutes?: number;
          focus_minutes_today?: number;
          joined_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          status?: string;
          task?: string | null;
          goal?: string | null;
          daily_goal_minutes?: number;
          focus_minutes_today?: number;
          joined_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

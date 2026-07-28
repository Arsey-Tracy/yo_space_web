export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  preferred_language: string;
  first_name?: string;
  last_name?: string;
}

export interface Organization {
  id: number;
  name: string;
  subscription_tier: string;
  sender_id?: string;
  default_language: string;
  sms_balance: number;
  owner?: User;
  spaces_count: number;
  created_at: string;
  updated_at: string;
}

export interface Space {
  id: number;
  organization?: number;
  name: string;
  description: string;
  host_phone: string;
  pin: string;
  is_public: boolean;
  is_active: boolean;
  members_count: number;
  active_listeners_count: number;
  created_at: string;
  updated_at: string;
}

export interface SpaceMember {
  id: number;
  space: number;
  user?: number;
  name?: string;
  phone_number: string;
  role: 'admin' | 'communications' | 'secretary' | 'member';
  joined_at: string;
}

export interface Broadcast {
  id: number;
  space: number;
  space_name?: string;
  created_by?: number;
  message: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduled_at?: string;
  sent_at?: string;
  recipients_count: number;
  cost_credits: number;
  created_at: string;
}

export interface SurveyQuestion {
  id: number;
  survey: number;
  question_text: string;
  question_type: 'text' | 'multiple_choice' | 'rating';
  options: string[];
  order: number;
  responses_count: number;
}

export interface Survey {
  id: number;
  space: number;
  space_name?: string;
  created_by?: number;
  title: string;
  description: string;
  is_active: boolean;
  questions: SurveyQuestion[];
  total_responses: number;
  created_at: string;
}

export interface Subscription {
  id: number;
  name: string;
  price: number;
  duration_in_days: number;
  max_spaces: number;
  max_members_per_space: number;
  monthly_sms_quota: number;
  allow_merge_spaces: boolean;
  allow_public_private: boolean;
  allow_analytics: boolean;
  allow_reports: boolean;
  allow_surveys: boolean;
  features: string;
  is_active: boolean;
}

export interface SMSBundle {
  id: number;
  name: string;
  sms_count: number;
  price: number;
  price_per_sms: number;
  is_active: boolean;
}

export interface DashboardStats {
  organization: string;
  subscription_tier: string;
  sms_balance: number;
  total_spaces: number;
  max_spaces_limit: number;
  total_members: number;
  max_members_per_space: number;
  broadcasts_sent_this_month: number;
  recent_broadcasts: Broadcast[];
}

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
  sender_id?: string;
  default_language: string;
  sms_balance: number;
  wallet_cash_balance_ugx?: number;
  payg_tier?: 'Starter' | 'Growth' | 'Enterprise Volume';
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

export interface SMSBundle {
  id: number;
  name: string;
  sms_count: number;
  price: number;
  price_per_sms: number;
  is_active: boolean;
}

export interface WalletTransaction {
  id: number;
  transaction_type: 'topup' | 'deduction';
  amount_paid_ugx: number;
  credits_added: number;
  payment_method: string;
  payment_reference: string;
  created_at: string;
  notes?: string;
}

export interface DashboardStats {
  organization: string;
  sms_balance: number;
  cash_balance_ugx?: number;
  total_spaces: number;
  total_members: number;
  broadcasts_sent_this_month: number;
  recent_broadcasts: Broadcast[];
  recent_transactions?: WalletTransaction[];
}


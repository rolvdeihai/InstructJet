export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Guide {
  id: string;
  slug: string;
  user_id: string;
  title: string;
  content: string;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
  total_token_budget: number;
  token_budget_remaining: number;
  is_public: boolean;
  password_hash: string | null;
}

export interface GuideListing {
  id: string;
  guide_id: string;
  description: string | null;
  category: string | null;
  contact_info: string | null;
  price: number | null;
  active_until: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
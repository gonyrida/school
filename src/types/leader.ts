export interface Leader {
  id: string;
  full_name: string;
  position: string;
  bio: string;
  email?: string;
  phone?: string;
  image_url?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface LeaderFormData {
  full_name: string;
  position: string;
  bio: string;
  email?: string;
  phone?: string;
  image_url?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  sort_order: number;
}

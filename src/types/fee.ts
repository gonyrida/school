export type FeeCategory = "school" | "dormitory" | "tuition";

export interface FeeItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  period: string; // e.g. "per year", "per semester"
  category: FeeCategory;
  badge?: string; // e.g. "Popular", "Recommended"
  icon?: string;  // lucide icon name
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FeeFormData {
  title: string;
  description: string;
  amount: number;
  currency: string;
  period: string;
  category: FeeCategory;
  badge?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

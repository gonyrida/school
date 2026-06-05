import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { FeeItem, FeeFormData } from "@/types/fee";

const STATIC_FEES: FeeItem[] = [
  {
    id: "1",
    title: "Annual School Fee",
    description: "Covers administrative costs, school resources, activity fees, and full access to all school facilities and programs.",
    amount: 1200,
    currency: "USD",
    period: "per year",
    category: "school",
    badge: "Required",
    icon: "School",
    sort_order: 0,
    is_active: true,
  },
  {
    id: "2",
    title: "Dormitory + Food Package",
    description: "Full board accommodation including a private or shared room, three nutritious meals daily, and laundry service.",
    amount: 2400,
    currency: "USD",
    period: "per year",
    category: "dormitory",
    badge: "Popular",
    icon: "Building2",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "3",
    title: "Tuition Fee",
    description: "Comprehensive academic instruction covering all subjects: Khmer, Arabic, English, Mathematics, Science, and more.",
    amount: 1800,
    currency: "USD",
    period: "per year",
    category: "tuition",
    badge: "Recommended",
    icon: "BookOpen",
    sort_order: 2,
    is_active: true,
  },
];

export function useFees() {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setFees(STATIC_FEES);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fee_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setFees(data || []);
    } catch (err) {
      console.error("Failed to fetch fees:", err);
      setFees(STATIC_FEES);
      setError("Failed to load fees from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFees();
  }, [fetchFees]);

  const createFee = useCallback(async (data: FeeFormData): Promise<FeeItem | null> => {
    if (!isSupabaseConfigured) {
      const newFee: FeeItem = { ...data, id: Date.now().toString() };
      setFees((prev) => [...prev, newFee].sort((a, b) => a.sort_order - b.sort_order));
      return newFee;
    }

    const { data: created, error } = await supabase
      .from("fee_items")
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    await fetchFees();
    return created;
  }, [fetchFees]);

  const updateFee = useCallback(async (id: string, data: Partial<FeeFormData>): Promise<void> => {
    if (!isSupabaseConfigured) {
      setFees((prev) => prev.map((f) => f.id === id ? { ...f, ...data } : f));
      return;
    }

    const { error } = await supabase
      .from("fee_items")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    await fetchFees();
  }, [fetchFees]);

  const deleteFee = useCallback(async (id: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      setFees((prev) => prev.filter((f) => f.id !== id));
      return;
    }

    const { error } = await supabase.from("fee_items").delete().eq("id", id);
    if (error) throw error;
    await fetchFees();
  }, [fetchFees]);

  return { fees, loading, error, createFee, updateFee, deleteFee, refetch: fetchFees };
}

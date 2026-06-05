import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Leader, LeaderFormData } from "@/types/leader";

// Fallback static data when Supabase is not configured
const STATIC_LEADERS: Leader[] = [
  {
    id: "1",
    full_name: "Dr. Ahmad Al-Hassan",
    position: "Principal",
    bio: "Dr. Al-Hassan brings over 20 years of educational leadership experience, guiding our school with vision, integrity, and a deep commitment to student excellence.",
    email: "principal@nics.edu.kh",
    sort_order: 0,
  },
  {
    id: "2",
    full_name: "Sarah Ibrahim",
    position: "Vice Principal",
    bio: "Ms. Ibrahim oversees academic programs and curriculum development, ensuring every student receives a world-class education.",
    email: "vp@nics.edu.kh",
    sort_order: 1,
  },
  {
    id: "3",
    full_name: "Mohammed Yusuf",
    position: "Head of Academics",
    bio: "Mr. Yusuf leads our academic team with innovation and dedication, fostering a culture of continuous learning.",
    sort_order: 2,
  },
  {
    id: "4",
    full_name: "Fatima Noor",
    position: "Head of Wellness",
    bio: "Ms. Noor champions student wellbeing and mental health, creating a nurturing environment for all learners.",
    sort_order: 3,
  },
  {
    id: "5",
    full_name: "Omar Khalid",
    position: "Head of Islamic Studies",
    bio: "Mr. Khalid brings deep knowledge and passion to our Islamic Studies program, connecting faith with modern education.",
    sort_order: 4,
  },
  {
    id: "6",
    full_name: "Amina Hassan",
    position: "Head of Languages",
    bio: "Ms. Hassan oversees our multilingual program in Khmer, Arabic, and English, ensuring linguistic excellence.",
    sort_order: 5,
  },
];

export function useLeaders() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaders = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLeaders(STATIC_LEADERS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leaders")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setLeaders(data || []);
    } catch (err) {
      console.error("Failed to fetch leaders:", err);
      setLeaders(STATIC_LEADERS);
      setError("Failed to load leaders from database, showing static data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeaders();
  }, [fetchLeaders]);

  const createLeader = useCallback(async (data: LeaderFormData): Promise<Leader | null> => {
    if (!isSupabaseConfigured) {
      const newLeader: Leader = { ...data, id: Date.now().toString() };
      setLeaders((prev) => [...prev, newLeader].sort((a, b) => a.sort_order - b.sort_order));
      return newLeader;
    }

    const { data: created, error } = await supabase
      .from("leaders")
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    await fetchLeaders();
    return created;
  }, [fetchLeaders]);

  const updateLeader = useCallback(async (id: string, data: Partial<LeaderFormData>): Promise<void> => {
    if (!isSupabaseConfigured) {
      setLeaders((prev) => prev.map((l) => l.id === id ? { ...l, ...data } : l));
      return;
    }

    const { error } = await supabase
      .from("leaders")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    await fetchLeaders();
  }, [fetchLeaders]);

  const deleteLeader = useCallback(async (id: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      setLeaders((prev) => prev.filter((l) => l.id !== id));
      return;
    }

    const { error } = await supabase.from("leaders").delete().eq("id", id);
    if (error) throw error;
    await fetchLeaders();
  }, [fetchLeaders]);

  const uploadImage = useCallback(async (file: File, leaderId: string): Promise<string> => {
    if (!isSupabaseConfigured) {
      return URL.createObjectURL(file);
    }

    const ext = file.name.split(".").pop();
    const path = `leaders/${leaderId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(path, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const reorderLeaders = useCallback(async (reordered: Leader[]): Promise<void> => {
    const updated = reordered.map((l, i) => ({ ...l, sort_order: i }));
    setLeaders(updated);

    if (!isSupabaseConfigured) return;

    const updates = updated.map((l) =>
      supabase.from("leaders").update({ sort_order: l.sort_order }).eq("id", l.id)
    );
    await Promise.all(updates);
  }, []);

  return { leaders, loading, error, createLeader, updateLeader, deleteLeader, uploadImage, reorderLeaders, refetch: fetchLeaders };
}

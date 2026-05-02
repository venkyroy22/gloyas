'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  role: 'user' | 'admin';
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (supabaseUser: SupabaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      setUser: (supabaseUser) => {
        if (supabaseUser) {
          set({
            user: {
              id: supabaseUser.id,
              name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
            },
            isAuthenticated: true,
          });
          get().fetchProfile();
        } else {
          set({ user: null, profile: null, isAuthenticated: false });
        }
      },
      setProfile: (profile) => set({ profile }),
      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          set({ profile: data });
        } else if (error && error.code === 'PGRST116') {
          // Profile doesn't exist yet, create it
          const newProfile = {
            id: user.id,
            full_name: user.name,
          };
          const { data: createdData } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
          if (createdData) set({ profile: createdData as UserProfile });
        }
      },
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null, isAuthenticated: false });
      },
    }),
    {
      name: 'gloyas-auth',
    }
  )
);

if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    useAuthStore.getState().setUser(session?.user || null);
  });
}

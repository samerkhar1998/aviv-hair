import { create } from 'zustand';
import { supabase } from '../lib/supabase'

type Profile = { id: string; role: 'admin'|'client'; full_name?: string|null };
type AuthState = {
  session: any | null;
  profile: Profile | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  loadSession(): Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  session: null,
  profile: null,
  loading: false,

  loadSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session: session ?? null });
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      set({ profile: data as any });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ session: data.session });
    await (useAuth.getState().loadSession());
    set({ loading: false });
  },

  signUp: async (name, email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // create the profile row (defaults to role 'client')
    if (data.user?.id) {
      await supabase.from('profiles').insert({ id: data.user.id, full_name: name, role: 'client' });
    }
    await (useAuth.getState().loadSession());
    set({ loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null });
  },
}));
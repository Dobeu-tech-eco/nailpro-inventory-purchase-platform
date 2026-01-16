import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, Organization, Location } from '../types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  organization: Organization | null;
  locations: Location[];
  currentLocation: Location | null;
  isLoading: boolean;
  isInitialized: boolean;
  signUp: (email: string, password: string, data: SignUpData) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setCurrentLocation: (location: Location) => void;
  refreshProfile: () => Promise<void>;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  businessName: string;
  zipCode: string;
  phone?: string;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  organization: null,
  locations: [],
  currentLocation: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user, session });
        await get().refreshProfile();
      }

      set({ isInitialized: true });

      supabase.auth.onAuthStateChange((_event, session) => {
        (async () => {
          set({ user: session?.user ?? null, session });
          if (session?.user) {
            await get().refreshProfile();
          } else {
            set({ profile: null, organization: null, locations: [], currentLocation: null });
          }
        })();
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isInitialized: true });
    }
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        set({ profile });

        const { data: organization } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.organization_id)
          .maybeSingle();

        if (organization) {
          set({ organization });

          const { data: locations } = await supabase
            .from('locations')
            .select('*')
            .eq('organization_id', organization.id)
            .order('is_primary', { ascending: false });

          if (locations && locations.length > 0) {
            set({ locations, currentLocation: locations[0] });
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  },

  signUp: async (email, password, data) => {
    set({ isLoading: true });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Signup failed');

      const slug = data.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.businessName,
          slug: `${slug}-${Date.now()}`,
          zip_code: data.zipCode,
          phone: data.phone || null,
          email: email,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      const { error: locationError } = await supabase
        .from('locations')
        .insert({
          organization_id: org.id,
          name: 'Main Location',
          zip_code: data.zipCode,
          is_primary: true,
        });

      if (locationError) throw locationError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          organization_id: org.id,
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'owner',
        });

      if (profileError) throw profileError;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      profile: null,
      organization: null,
      locations: [],
      currentLocation: null,
    });
  },

  setCurrentLocation: (location) => {
    set({ currentLocation: location });
  },
}));

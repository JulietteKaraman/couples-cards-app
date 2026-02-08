"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";
import { EntitlementsRow } from "@/lib/supabase/client";
import { verifyUserAccess } from "@/app/actions/verify-access";

interface AuthContextType {
  user: User | null;
  profile: EntitlementsRow | null;
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<EntitlementsRow | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify access when user changes
  async function checkAccess(userId: string) {
    try {
      const result = await verifyUserAccess(userId);
      setProfile(result.profile);
      setHasAccess(result.hasAccess);
    } catch (err) {
      console.error("Error verifying access:", err);
      setProfile(null);
      setHasAccess(false);
    }
  }

  // Initialize auth state
  useEffect(() => {
    async function initializeAuth() {
      try {
        const { data } = await supabaseBrowser.auth.getUser();
        setUser(data.user);
        if (data.user) {
          await checkAccess(data.user.id);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (newUser) {
        checkAccess(newUser.id);
      } else {
        setProfile(null);
        setHasAccess(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    setError(null);
    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Auth state change listener will update user and trigger access check
    } catch (err: any) {
      setError(err.message ?? "Sign in failed");
      throw err;
    }
  }

  async function signUp(email: string, password: string) {
    setError(null);
    try {
      const { error } = await supabaseBrowser.auth.signUp({ email, password });
      if (error) throw error;
      // Auth state change listener will update user
    } catch (err: any) {
      setError(err.message ?? "Sign up failed");
      throw err;
    }
  }

  async function signOut() {
    setError(null);
    try {
      const { error } = await supabaseBrowser.auth.signOut();
      if (error) throw error;
      // Auth state change listener will update user to null
    } catch (err: any) {
      setError(err.message ?? "Sign out failed");
      throw err;
    }
  }

  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        hasAccess,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

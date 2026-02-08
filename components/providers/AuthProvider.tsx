"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    async function initializeAuth() {
      try {
        const { data } = await supabaseBrowser.auth.getUser();
        setUser(data.user);
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
      setUser(session?.user ?? null);
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
      // Auth state change listener will update user
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

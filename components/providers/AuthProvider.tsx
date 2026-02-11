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
  purchasedDecks: string[];
  loading: boolean;
  error: string | null;
  userName: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshAccess: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<EntitlementsRow | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [purchasedDecks, setPurchasedDecks] = useState<string[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify access when user changes
  async function checkAccess(userId: string) {
    try {
      // Get user data to extract name from metadata
      const { data: userData } = await supabaseBrowser.auth.getUser();
      const firstName = userData.user?.user_metadata?.first_name;
      const lastName = userData.user?.user_metadata?.last_name;
      if (firstName) {
        setUserName(firstName);
      }

      // Check legacy entitlements (for couples access)
      const result = await verifyUserAccess(userId);
      setProfile(result.profile);
      setHasAccess(result.hasAccess);

      // Also check new user_decks table for multi-deck support
      const { data: userDecks, error: decksError } = await supabaseBrowser
        .from("user_decks")
        .select("deck_type")
        .eq("user_id", userId);

      if (decksError) {
        console.error("Error fetching user decks:", decksError);
      } else if (userDecks) {
        const decks = userDecks.map((d) => d.deck_type);
        setPurchasedDecks(decks);
        
        // Also set hasAccess if they have couples in new table
        if (decks.includes("couples")) {
          setHasAccess(true);
        }
      }
    } catch (err) {
      console.error("Error verifying access:", err);
      setProfile(null);
      setHasAccess(false);
      setPurchasedDecks([]);
      setUserName(null);
    }
  }

  // Refresh access (useful after restore purchase)
  async function refreshAccess() {
    if (user?.id) {
      await checkAccess(user.id);
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
        setPurchasedDecks([]);
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

  async function signUp(email: string, password: string, firstName: string, lastName: string) {
    setError(null);
    try {
      const { error } = await supabaseBrowser.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
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
      setPurchasedDecks([]);
      setUserName(null);
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
        purchasedDecks,
        userName,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
        refreshAccess,
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

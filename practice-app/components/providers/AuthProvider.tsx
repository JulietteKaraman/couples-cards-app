"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";
import { deckTypesForApp, collectionSlugForDeckType } from "@/lib/entitlements/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  entitledCollections: string[]; // collection slugs, not deck_type values
  sendMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshEntitlements: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [entitledCollections, setEntitledCollections] = useState<string[]>([]);

  const loadEntitlements = useCallback(async (userId: string) => {
    const { data, error } = await supabaseBrowser
      .from("user_decks")
      .select("deck_type")
      .eq("user_id", userId)
      .in("deck_type", deckTypesForApp());

    if (error) {
      console.error("Error loading entitlements:", error);
      setEntitledCollections([]);
      return;
    }

    const slugs = (data ?? [])
      .map((row) => collectionSlugForDeckType(row.deck_type))
      .filter((slug): slug is string => Boolean(slug));
    setEntitledCollections(slugs);
  }, []);

  // Free guides (FREE_DECK_TYPES) are granted automatically to every
  // signed-in account, no purchase, no price ever shown — see
  // app/api/ensure-free-access. Called before loadEntitlements so a
  // first-time visitor's free guides are already unlocked the moment the
  // library renders, not one refresh later. Failure here (network hiccup,
  // route down) is non-fatal — entitlements still load, the free guides
  // just wait for the next session refresh to appear, not worth blocking
  // sign-in over.
  const ensureFreeAccessAndLoad = useCallback(
    async (userId: string, email: string | undefined) => {
      if (email) {
        try {
          await fetch("/api/ensure-free-access", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, email }),
          });
        } catch (err) {
          console.error("ensure-free-access failed:", err);
        }
      }
      await loadEntitlements(userId);
    },
    [loadEntitlements]
  );

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        ensureFreeAccessAndLoad(data.session.user.id, data.session.user.email);
      }
      setLoading(false);
    });

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          ensureFreeAccessAndLoad(session.user.id, session.user.email);
        } else {
          setEntitledCollections([]);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [ensureFreeAccessAndLoad]);

  async function sendMagicLink(email: string) {
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    setUser(null);
    setEntitledCollections([]);
  }

  async function refreshEntitlements() {
    if (user?.id) await loadEntitlements(user.id);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, entitledCollections, sendMagicLink, signOut, refreshEntitlements }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

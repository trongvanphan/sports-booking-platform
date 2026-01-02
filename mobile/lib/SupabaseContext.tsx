/**
 * Supabase Context Provider
 * Provides Supabase client and database helpers to the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { supabase, db, auth } from './supabase';

interface SupabaseContextType {
  supabase: typeof supabase;
  db: typeof db;
  auth: typeof auth;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  return (
    <SupabaseContext.Provider value={{ supabase, db, auth }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
}

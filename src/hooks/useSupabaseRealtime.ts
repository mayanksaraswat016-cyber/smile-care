'use client';
import { useEffect } from 'react';
import { mutate } from 'swr';
import { supabase } from '@/lib/supabase';

/**
 * useSupabaseRealtime
 *
 * Subscribes to changes on a specific Supabase table and triggers
 * an SWR revalidation (mutate) whenever an event occurs.
 *
 * @param table - The database table name to watch
 * @param swrKey - The SWR key (API route) to revalidate
 */
export function useSupabaseRealtime(table: string, swrKey: string | null) {
  useEffect(() => {
    if (!swrKey) return;
    // 1. Create a channel for this table
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, and DELETE
          schema: 'public',
          table: table,
        },
        (payload: any) => {
          console.log(`Real-time update on ${table}:`, payload);
          // 2. Tell SWR to re-fetch the data instantly
          mutate(swrKey);
        }
      )
      .subscribe();

    // 3. Cleanup: Unsubscribe when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, swrKey]);
}

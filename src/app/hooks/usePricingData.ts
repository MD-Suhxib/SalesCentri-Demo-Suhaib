"use client";

import { useEffect, useState } from 'react';
import { getFirestoreClient } from '@/app/lib/firebaseClient';
import { collection, onSnapshot, query } from 'firebase/firestore';

export type PricingDoc = {
  segment: string; // "Personal", "Business", or "Funnel Level"
  billingCycle: string;
  planName?: string; // For Personal/Business plans
  tagline?: string;
  price: number | string;
  credits?: number | string;
  aiHunterSearches?: number | string;
  contactValidations?: number | string;
  features?: string[];
  updatedAt?: string;
  // Funnel Level specific fields
  funnelLevel?: string; // "TOFU" | "MOFU" | "BOFU"
  leadGenName?: string; // "Email Marketing Campaign", "MQL", "SQL", etc.
  type?: string; // "Inbound/Outbound", "Qualification Metric", "Performance-based model", etc.
  minimumPrice?: number; // Minimum price for the model
};

export function usePricingData() {
  const [data, setData] = useState<PricingDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    let cancelled = false;

    const db = getFirestoreClient();
    if (db) {
      // Real-time subscription from Firestore on client
      const q = query(collection(db, 'pricing'));
      unsub = onSnapshot(q, (snap) => {
        const rows: PricingDoc[] = [];
        snap.forEach((doc) => rows.push(doc.data() as PricingDoc));
        if (!cancelled) {
          setData(rows);
          setLoading(false);
        }
      }, (err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load pricing');
          setLoading(false);
        }
      });

      // Also fetch meta for updatedAt if desired in future
      // Defer for simplicity; API can still provide updatedAt
    } else {
      // Fallback to API endpoint
      (async () => {
        try {
          const res = await fetch('/api/get-pricing', { cache: 'no-store' });
          const json = await res.json();
          setData(Array.isArray(json?.data) ? json.data : []);
          setUpdatedAt(json?.updatedAt ?? null);
        } catch (e: any) {
          setError(e?.message || 'Failed to load pricing');
        } finally {
          setLoading(false);
        }
      })();
    }

    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, []);

  return { data, loading, error, updatedAt };
}



/**
 * Price Fetching Utilities
 * Shared functions for fetching pricing data from Firestore
 */

import { adminDb } from '@/app/lib/firebaseAdmin';
import { makeDocId } from '@/app/lib/pricingRepo';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

/**
 * Get price from Firestore using Admin SDK
 */
export async function getPriceFromFirestore(
  segment: string,
  billingCycle: string,
  planName?: string,
  funnelLevel?: string,
  leadGenName?: string
): Promise<number | null> {
  try {
    if (!adminDb) return null;
    let query = adminDb.collection('pricing')
      .where('segment', '==', segment)
      .where('billingCycle', '==', billingCycle);
    
    if (segment === 'Funnel Level') {
      if (funnelLevel) query = query.where('funnelLevel', '==', funnelLevel);
      if (leadGenName) query = query.where('leadGenName', '==', leadGenName);
    } else {
      if (planName) query = query.where('planName', '==', planName);
    }
    
    const snap = await query.limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0].data() as { price?: unknown; minimumPrice?: unknown };
    // For funnel-level, prefer minimumPrice
    if (segment === 'Funnel Level' && typeof doc.minimumPrice === 'number') {
      return doc.minimumPrice;
    }
    if (typeof doc.price === 'number') return doc.price;
    return null;
  } catch {
    return null;
  }
}

/**
 * Get price from Firestore using Client SDK (fallback)
 */
export async function getPriceFromClientFallback(
  segment: string,
  billingCycle: string,
  planName?: string,
  funnelLevel?: string,
  leadGenName?: string
): Promise<number | null> {
  try {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    } as const;
    if (!config.projectId || !config.apiKey) return null;
    const app = getApps().length ? getApps()[0] : initializeApp(config);
    const db = getFirestore(app);
    const id = makeDocId({ segment, billingCycle, planName, funnelLevel, leadGenName } as any);
    const ref = doc(db, 'pricing', id);
    const s = await getDoc(ref);
    if (!s.exists()) return null;
    const data = s.data() as { price?: unknown; minimumPrice?: unknown };
    // For funnel-level, prefer minimumPrice
    if (segment === 'Funnel Level' && typeof data.minimumPrice === 'number') {
      return data.minimumPrice;
    }
    if (typeof data.price !== 'number') return null;
    return data.price;
  } catch {
    return null;
  }
}


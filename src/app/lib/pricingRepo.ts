import type { Firestore as AdminFirestore } from 'firebase-admin/firestore';
import { adminDb } from './firebaseAdmin';
import { getApps as getClientApps, initializeApp as initClientApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore as getClientFirestore,
  collection as clientCollection,
  doc as clientDoc,
  writeBatch as clientWriteBatch,
  getDocs as clientGetDocs,
  getDoc as clientGetDoc,
  deleteDoc as clientDeleteDoc,
  type Firestore as ClientFirestore,
} from 'firebase/firestore';

export type PricingRow = {
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

function makeDocId(row: Pick<PricingRow, 'segment' | 'billingCycle' | 'planName' | 'funnelLevel' | 'leadGenName'>): string {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  // For Funnel Level models, use funnelLevel + leadGenName instead of planName
  if (row.segment?.toLowerCase() === 'funnel level' && row.funnelLevel && row.leadGenName) {
    return `${slug(String(row.segment))}__${slug(String(row.billingCycle))}__${slug(String(row.funnelLevel))}__${slug(String(row.leadGenName))}`;
  }
  // For Personal/Business plans, use planName
  return `${slug(String(row.segment))}__${slug(String(row.billingCycle))}__${slug(String(row.planName || ''))}`;
}

function getClientDbFromEnv(): ClientFirestore | null {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  } as const;
  if (!config.projectId || !config.apiKey) return null;
  const apps = getClientApps();
  const app: FirebaseApp = apps.length ? apps[0] : initClientApp(config);
  return getClientFirestore(app);
}

async function ensureCollectionsExist(cdb: ClientFirestore): Promise<void> {
  try {
    // Check if pricing_meta collection exists by trying to read it
    const metaRef = clientDoc(clientCollection(cdb, 'pricing_meta'), 'meta');
    const metaSnap = await clientGetDoc(metaRef);
    
    if (!metaSnap.exists()) {
      // Create meta document to ensure collection exists
      const batch = clientWriteBatch(cdb);
      const now = new Date().toISOString();
      batch.set(metaRef, { updatedAt: now, count: 0 }, { merge: true } as any);
      await batch.commit();
      console.log('Created pricing_meta collection');
    }
  } catch (error: any) {
    // Check if it's a NOT_FOUND error (database doesn't exist)
    if (error?.code === 'not-found' || error?.message?.includes('NOT_FOUND') || error?.code === 5) {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      throw new Error(
        `Firestore database not found (NOT_FOUND). ` +
        `Please verify:\n` +
        `1. Firestore database exists in Firebase Console for project: ${projectId}\n` +
        `2. Database is in Native mode (not Datastore mode)\n` +
        `3. Firestore API is enabled in Google Cloud Console\n` +
        `4. Project ID matches: ${projectId}`
      );
    }
    // Other errors - collection will be created on first write
    console.log('Collections will be auto-created on first write');
  }
}

/**
 * Clean up old pricing documents that are being replaced by new ones
 * This handles the case where plan names change (e.g., "Free" -> "Startup")
 */
async function cleanupOldPricingDocuments(
  newRows: PricingRow[],
  db: AdminFirestore | null,
  cdb: ClientFirestore | null
): Promise<number> {
  let deletedCount = 0;
  
  // Group new rows by segment and billing cycle
  const newRowsBySegmentCycle = new Map<string, Set<string>>();
  for (const row of newRows) {
    const key = `${row.segment.toLowerCase()}__${row.billingCycle.toLowerCase()}`;
    if (!newRowsBySegmentCycle.has(key)) {
      newRowsBySegmentCycle.set(key, new Set());
    }
    const identifiers = newRowsBySegmentCycle.get(key)!;
    
    if (row.segment?.toLowerCase() === 'funnel level' && row.funnelLevel && row.leadGenName) {
      identifiers.add(`${row.funnelLevel.toLowerCase()}__${row.leadGenName.toLowerCase()}`);
    } else if (row.planName) {
      identifiers.add(row.planName.toLowerCase());
    }
  }
  
  try {
    if (db) {
      // Admin SDK path
      const allDocs = await db.collection('pricing').get();
      const deleteBatch = db.batch();
      let hasDeletes = false;
      
      for (const doc of allDocs.docs) {
        const data = doc.data() as PricingRow;
        const segment = String(data.segment || '').toLowerCase();
        const billingCycle = String(data.billingCycle || '').toLowerCase();
        const key = `${segment}__${billingCycle}`;
        
        if (newRowsBySegmentCycle.has(key)) {
          const identifiers = newRowsBySegmentCycle.get(key)!;
          let shouldDelete = false;
          
          if (segment === 'funnel level' && data.funnelLevel && data.leadGenName) {
            const identifier = `${String(data.funnelLevel).toLowerCase()}__${String(data.leadGenName).toLowerCase()}`;
            shouldDelete = !identifiers.has(identifier);
          } else if (data.planName) {
            const identifier = String(data.planName).toLowerCase();
            shouldDelete = !identifiers.has(identifier);
          }
          
          if (shouldDelete) {
            deleteBatch.delete(doc.ref);
            hasDeletes = true;
            deletedCount++;
          }
        }
      }
      
      if (hasDeletes) {
        await deleteBatch.commit();
        console.log(`Cleaned up ${deletedCount} old pricing documents`);
      }
    } else if (cdb) {
      // Client SDK path
      const allDocs = await clientGetDocs(clientCollection(cdb, 'pricing'));
      const deletePromises: Promise<void>[] = [];
      
      for (const doc of allDocs.docs) {
        const data = doc.data() as PricingRow;
        const segment = String(data.segment || '').toLowerCase();
        const billingCycle = String(data.billingCycle || '').toLowerCase();
        const key = `${segment}__${billingCycle}`;
        
        if (newRowsBySegmentCycle.has(key)) {
          const identifiers = newRowsBySegmentCycle.get(key)!;
          let shouldDelete = false;
          
          if (segment === 'funnel level' && data.funnelLevel && data.leadGenName) {
            const identifier = `${String(data.funnelLevel).toLowerCase()}__${String(data.leadGenName).toLowerCase()}`;
            shouldDelete = !identifiers.has(identifier);
          } else if (data.planName) {
            const identifier = String(data.planName).toLowerCase();
            shouldDelete = !identifiers.has(identifier);
          }
          
          if (shouldDelete) {
            deletePromises.push(clientDeleteDoc(doc.ref));
            deletedCount++;
          }
        }
      }
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`Cleaned up ${deletedCount} old pricing documents`);
      }
    }
  } catch (error) {
    console.error('Error during cleanup of old pricing documents:', error);
    // Don't throw - cleanup is best effort
  }
  
  return deletedCount;
}

export async function upsertPricingRows(rows: PricingRow[], db: AdminFirestore | null = adminDb) {
  const now = new Date().toISOString();
  
  // Clean up old documents before inserting new ones
  if (db) {
    await cleanupOldPricingDocuments(rows, db, null);
  }
  
  if (db) {
    const col = db.collection('pricing');
    const batch = db.batch();
    for (const row of rows) {
      const id = makeDocId(row);
      const ref = col.doc(id);
      batch.set(ref, { ...row, updatedAt: now }, { merge: true });
    }
    const metaRef = db.collection('pricing_meta').doc('meta');
    batch.set(metaRef, { updatedAt: now, count: rows.length }, { merge: true });
    await batch.commit();
    return { updatedAt: now, count: rows.length };
  }

  // Fallback: use client SDK with NEXT_PUBLIC_* in server environment
  const cdb = getClientDbFromEnv();
  if (!cdb) throw new Error('Firebase is not initialized');
  
  // Clean up old documents before inserting new ones
  await cleanupOldPricingDocuments(rows, null, cdb);
  
  // Ensure collections exist before writing
  try {
    await ensureCollectionsExist(cdb);
  } catch (error: any) {
    // Re-throw with context if it's a NOT_FOUND error
    if (error?.message?.includes('NOT_FOUND') || error?.code === 'not-found' || error?.code === 5) {
      throw error;
    }
    // For other errors, continue - collections will be created on write
  }
  
  try {
    const batch = clientWriteBatch(cdb);
    for (const row of rows) {
      const id = makeDocId(row);
      const ref = clientDoc(clientCollection(cdb, 'pricing'), id);
      batch.set(ref, { ...row, updatedAt: now }, { merge: true } as any);
    }
    const metaRef = clientDoc(clientCollection(cdb, 'pricing_meta'), 'meta');
    batch.set(metaRef, { updatedAt: now, count: rows.length }, { merge: true } as any);
    await batch.commit();
    return { updatedAt: now, count: rows.length };
  } catch (error: any) {
    // Check for NOT_FOUND errors during write
    if (error?.code === 'not-found' || error?.message?.includes('NOT_FOUND') || error?.code === 5) {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      throw new Error(
        `Failed to write to Firestore: Database not found (NOT_FOUND). ` +
        `Verify Firestore database exists in Firebase Console for project: ${projectId}. ` +
        `Make sure database is in Native mode and Firestore API is enabled.`
      );
    }
    throw error;
  }
}

export async function getAllPricing(db: AdminFirestore | null = adminDb): Promise<{ data: PricingRow[]; updatedAt: string | null }> {
  if (db) {
    const [snap, meta] = await Promise.all([
      db.collection('pricing').get(),
      db.collection('pricing_meta').doc('meta').get(),
    ]);
    const data: PricingRow[] = [];
    snap.forEach((doc) => {
      const d = doc.data() as PricingRow;
      data.push(d);
    });
    const updatedAt = (meta.exists && (meta.data()?.updatedAt as string)) || null;
    return { data, updatedAt };
  }

  const cdb = getClientDbFromEnv();
  if (!cdb) throw new Error('Firebase is not initialized');
  
  try {
    const snap = await clientGetDocs(clientCollection(cdb, 'pricing'));
    const data: PricingRow[] = snap.docs.map((d) => d.data() as PricingRow);
    const meta = await clientGetDoc(clientDoc(clientCollection(cdb, 'pricing_meta'), 'meta'));
    const updatedAt = (meta.exists() && ((meta.data() as any)?.updatedAt as string)) || null;
    return { data, updatedAt };
  } catch (error: any) {
    // If collections don't exist yet, return empty array
    if (error?.code === 'not-found' || error?.message?.includes('NOT_FOUND')) {
      return { data: [], updatedAt: null };
    }
    throw error;
  }
}

export { makeDocId };



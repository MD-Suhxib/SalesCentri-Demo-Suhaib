import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseClientApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (app) return app;

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  } as const;

  if (!config.projectId || !config.apiKey) {
    return null;
  }

  app = getApps().length ? getApps()[0] : initializeApp(config);
  return app;
}

export function getFirestoreClient(): Firestore | null {
  if (typeof window === 'undefined') return null;
  if (db) return db;
  const a = getFirebaseClientApp();
  if (!a) return null;
  db = getFirestore(a);
  return db;
}



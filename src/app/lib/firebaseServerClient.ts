import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

let serverApp: FirebaseApp | null = null;
let serverDb: Firestore | null = null;

function getFirebaseConfig() {
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

    return config;
}

export function getFirebaseServerApp(): FirebaseApp | null {
    if (serverApp) {
        return serverApp;
    }

    const config = getFirebaseConfig();
    if (!config) {
        return null;
    }

    const existingApps = getApps();
    serverApp = existingApps.length ? existingApps[0] : initializeApp(config);
    return serverApp;
}

export function getFirebaseServerDb(): Firestore | null {
    if (serverDb) {
        return serverDb;
    }

    const app = getFirebaseServerApp();
    if (!app) {
        return null;
    }

    serverDb = getFirestore(app);
    return serverDb;
}



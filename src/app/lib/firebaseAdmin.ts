import admin from 'firebase-admin';

function getServiceAccountFromEnv(): admin.ServiceAccount | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      const parsed = JSON.parse(json);
      return {
        projectId: parsed.project_id || parsed.projectId,
        clientEmail: parsed.client_email || parsed.clientEmail,
        privateKey: (parsed.private_key || parsed.privateKey || '').replace(/\\n/g, '\n'),
      } as admin.ServiceAccount;
    } catch {
      // fallthrough
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey,
    } as admin.ServiceAccount;
  }

  return null;
}

// Initialize admin SDK once per runtime
if (!admin.apps.length) {
  const svc = getServiceAccountFromEnv();
  const hasADC = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
  try {
    if (svc) {
      admin.initializeApp({
        credential: admin.credential.cert(svc),
        projectId: (svc as any).projectId,
      } as any);
    } else if (hasADC) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId:
          process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      } as any);
    } else {
      // No server credentials available; skip admin init so client SDK fallback is used
    }
    if (admin.apps.length) {
      try {
        admin.firestore().settings({ ignoreUndefinedProperties: true });
      } catch {}
    }
  } catch {
    // Leave admin uninitialized on failure
  }
}

export const adminApp = admin.apps.length ? admin.app() : null;
export const adminDb = adminApp ? admin.firestore() : null;



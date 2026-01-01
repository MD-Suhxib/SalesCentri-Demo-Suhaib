/*
  Initialization script to create Firestore pricing collection and optionally
  migrate existing data/pricing.json into Firestore.

  Usage:
    node scripts/initPricing.js

  Required env (admin credentials):
    - FIREBASE_SERVICE_ACCOUNT_JSON (preferred) OR
    - FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
*/

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function getServiceAccountFromEnv() {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (json) {
        try {
            const parsed = JSON.parse(json);
            return {
                projectId: parsed.project_id || parsed.projectId,
                clientEmail: parsed.client_email || parsed.clientEmail,
                privateKey: String(parsed.private_key || parsed.privateKey || '').replace(/\\n/g, '\n'),
            };
        } catch (e) {
            console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON:', e.message);
        }
    }
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    if (projectId && clientEmail && privateKey) {
        return { projectId, clientEmail, privateKey };
    }
    return null;
}

function makeDocId(segment, billingCycle, planName) {
    const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${slug(segment)}__${slug(billingCycle)}__${slug(planName)}`;
}

async function main() {
    const svc = getServiceAccountFromEnv();
    if (!svc) {
        console.error('Missing Firebase admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY');
        process.exit(1);
    }

    if (!admin.apps.length) {
        admin.initializeApp({ credential: admin.credential.cert(svc) });
        try { admin.firestore().settings({ ignoreUndefinedProperties: true }); } catch {}
    }

    const db = admin.firestore();
    const pricingCol = db.collection('pricing');
    const metaRef = db.collection('pricing_meta').doc('meta');

    // Ensure collection exists by creating/merging meta
    const now = new Date().toISOString();
    await metaRef.set({ updatedAt: now }, { merge: true });
    console.log('Ensured pricing_meta/meta document.');

    // Optional migration from local data/pricing.json
    const dataDir = path.join(process.cwd(), 'data');
    const pricingPath = path.join(dataDir, 'pricing.json');
    if (fs.existsSync(pricingPath)) {
        console.log('Found local data/pricing.json. Migrating to Firestore...');
        const raw = fs.readFileSync(pricingPath, 'utf8');
        const json = JSON.parse(raw);
        const rows = Array.isArray(json ? .data) ? json.data : Array.isArray(json) ? json : [];
        if (rows.length) {
            const batch = db.batch();
            for (const r of rows) {
                const id = makeDocId(r.segment, r.billingCycle, r.planName);
                const ref = pricingCol.doc(id);
                batch.set(ref, {...r, updatedAt: now }, { merge: true });
            }
            batch.set(metaRef, { updatedAt: now, count: rows.length }, { merge: true });
            await batch.commit();
            console.log(`Migrated ${rows.length} pricing rows to Firestore.`);
        } else {
            console.log('No rows found in local pricing.json.');
        }
    } else {
        console.log('No local pricing.json found. Collection initialized with meta only.');
    }

    console.log('Initialization completed.');
}

main().catch((e) => {
    console.error('Initialization failed:', e);
    process.exit(1);
});
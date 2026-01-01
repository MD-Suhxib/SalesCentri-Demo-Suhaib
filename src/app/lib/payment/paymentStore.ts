import admin from "firebase-admin";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
    type Firestore,
} from "firebase/firestore";

import { adminDb } from "@/app/lib/firebaseAdmin";
import { getFirebaseServerDb } from "@/app/lib/firebaseServerClient";

const DEFAULT_COLLECTION = "payments";

export interface PaymentRecordInput {
    gateway: string;
    orderId?: string | null;
    sessionId?: string | null;
    transactionId?: string | null;
    txnid?: string | null;
    amount?: number | string | null;
    currency?: string | null;
    segment?: string | null;
    billingCycle?: string | null;
    planName?: string | null;
    status?: string | null;
    userEmail?: string | null;
    source?: string | null;
    metadata?: Record<string, unknown> | null;
    rawPayload?: Record<string, unknown> | null;
}

export interface PaymentRecordWriteOptions {
    docId?: string;
    merge?: boolean;
    collectionName?: string;
}

export interface PaymentRecordWriteResult {
    id: string;
    usingAdmin: boolean;
}

function resolveFirestore():
    | { db: admin.firestore.Firestore; usingAdmin: true }
    | { db: Firestore; usingAdmin: false }
    | null {
    if (adminDb) {
        return { db: adminDb, usingAdmin: true };
    }

    const fallbackDb = getFirebaseServerDb();
    if (fallbackDb) {
        return { db: fallbackDb, usingAdmin: false };
    }

    return null;
}

function toNullableString(value: unknown): string | null {
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length ? trimmed : null;
    }
    return null;
}

function toNullableLowerEmail(value: unknown): string | null {
    const str = toNullableString(value);
    return str ? str.toLowerCase() : null;
}

function toNullableNumber(value: unknown): number | null {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }
    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

function sanitizeObject(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== "object") {
        return null;
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return null;
    }
}

function normalizeRecord(input: PaymentRecordInput): Record<string, unknown> {
    const amount = toNullableNumber(input.amount ?? null);
    const currency = toNullableString(input.currency)?.toUpperCase() ?? null;

    const record: Record<string, unknown> = {
        gateway: toNullableString(input.gateway) ?? "unknown",
        orderId: toNullableString(input.orderId),
        sessionId: toNullableString(input.sessionId),
        transactionId:
            toNullableString(input.transactionId) ?? toNullableString(input.txnid),
        txnid: toNullableString(input.txnid),
        amount,
        amountFormatted: amount !== null ? amount.toFixed(2) : null,
        currency,
        segment: toNullableString(input.segment),
        billingCycle: toNullableString(input.billingCycle),
        planName: toNullableString(input.planName),
        status: toNullableString(input.status)?.toLowerCase() ?? null,
        userEmail: toNullableLowerEmail(input.userEmail),
        source: toNullableString(input.source),
        metadata: sanitizeObject(input.metadata) ?? {},
        rawPayload: sanitizeObject(input.rawPayload),
    };

    return record;
}

export async function writePaymentRecord(
    input: PaymentRecordInput,
    options: PaymentRecordWriteOptions = {}
): Promise<PaymentRecordWriteResult> {
    const resolved = resolveFirestore();

    if (!resolved) {
        throw new Error("Firestore is not configured for server-side payment writes.");
    }

    const { db, usingAdmin } = resolved;
    const collectionName = options.collectionName ?? DEFAULT_COLLECTION;
    const merge = options.merge ?? false;
    const record = normalizeRecord(input);

    if (usingAdmin) {
        const adminDbInstance = db as admin.firestore.Firestore;
        const collectionRef = adminDbInstance.collection(collectionName);
        const docRef = options.docId
            ? collectionRef.doc(options.docId)
            : collectionRef.doc();
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        const data = {
            ...record,
            updatedAt: timestamp,
            ...(merge ? {} : { createdAt: timestamp }),
        };

        await docRef.set(data, { merge });

        return { id: docRef.id, usingAdmin };
    }

    const clientDb = db as Firestore;
    const collectionRef = collection(clientDb, collectionName);
    const timestamp = serverTimestamp();
    const data = {
        ...record,
        updatedAt: timestamp,
        ...(merge ? {} : { createdAt: timestamp }),
    };

    if (options.docId) {
        const docRef = doc(collectionRef, options.docId);
        await setDoc(docRef, data, { merge });
        return { id: options.docId, usingAdmin };
    }

    const docRef = await addDoc(collectionRef, data);
    return { id: docRef.id, usingAdmin };
}



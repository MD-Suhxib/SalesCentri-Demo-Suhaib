import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import { adminDb } from "@/app/lib/firebaseAdmin";
import { getFirebaseServerDb } from "@/app/lib/firebaseServerClient";
import { collection, addDoc, serverTimestamp, type Firestore } from "firebase/firestore";

const ALLOWED_SELECTIONS = ["optout", "erase", "sar", "complaint"] as const;
type SelectionId = (typeof ALLOWED_SELECTIONS)[number];

const SELECTION_LABELS: Record<SelectionId, string> = {
    optout: "Stop All Future Communication",
    erase: "Remove My Information (Erasure)",
    sar: "Understand What Data Is Used",
    complaint: "Raise a Complaint or Correction",
};

const EMAIL_RECIPIENT = "chitrangi.bhatnagarsc@outlook.com";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getIpAddress(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const [first] = forwarded.split(",");
        if (first) {
            return first.trim();
        }
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return "unknown";
}

function assertEnv() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error(
            "SMTP credentials are not configured. Ensure SMTP_USER and SMTP_PASS environment variables are set."
        );
    }
}

async function writePrivacySelection(
    db: admin.firestore.Firestore | Firestore,
    payload: Record<string, unknown>,
    useAdmin: boolean
) {
    if (useAdmin) {
        const adminDatabase = db as admin.firestore.Firestore;
        const docRef = await adminDatabase.collection("privacySelections").add({
            ...payload,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return docRef.id;
    }

    const clientDatabase = db as Firestore;
    const docRef = await addDoc(collection(clientDatabase, "privacySelections"), {
        ...payload,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function POST(request: NextRequest) {
    try {
        const fallbackDb = adminDb ? null : getFirebaseServerDb();
        const database = adminDb ?? fallbackDb;
        const usingAdmin = Boolean(adminDb);

        if (!database) {
            return NextResponse.json(
                { error: "Privacy submission is temporarily unavailable. Please try again later." },
                { status: 503 }
            );
        }

        const body = await request.json();
        const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";
        const selection = body?.selection as SelectionId | undefined;

        if (!rawEmail || !emailRegex.test(rawEmail)) {
            return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
        }

        if (!selection || !ALLOWED_SELECTIONS.includes(selection)) {
            return NextResponse.json({ error: "Please select a valid privacy request option." }, { status: 400 });
        }

        const selectionLabel = SELECTION_LABELS[selection];
        const ipAddress = getIpAddress(request);
        const userAgent = request.headers.get("user-agent") || "unknown";

        const payload: Record<string, unknown> = {
            email: rawEmail.toLowerCase(),
            selection,
            selectionLabel,
            ipAddress,
            userAgent,
        };

        const docId = await writePrivacySelection(database, payload, usingAdmin);

        assertEnv();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.office365.com",
            port: parseInt(process.env.SMTP_PORT || "587", 10),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
        });

        const submittedAt = new Date().toISOString();

        const textBody = [
            "A new privacy center request has been submitted.",
            "",
            `Email: ${rawEmail}`,
            `Requested Action: ${selectionLabel} (${selection})`,
            `Firestore Document ID: ${docId}`,
            "",
            `IP Address: ${ipAddress}`,
            `User Agent: ${userAgent}`,
            `Submitted At: ${submittedAt}`,
        ].join("\n");

        await transporter.sendMail({
            from: process.env.SMTP_USER as string,
            to: EMAIL_RECIPIENT,
            subject: `Privacy Center Request: ${selectionLabel}`,
            text: textBody,
            html: textBody.replace(/\n/g, "<br>"),
        });

        return NextResponse.json({ success: true, id: docId });
    } catch (error) {
        console.error("Failed to process privacy request:", error);
        return NextResponse.json({ error: "Failed to submit your request. Please try again later." }, { status: 500 });
    }
}



import { NextRequest, NextResponse } from "next/server";
import { sendPrintMediaOCREmail } from "@/app/lib/email";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_FILES = 60;
const MAX_SIZE_MB = 10;
const RATE_LIMIT = 5; // max uploads per hour per user

// Dummy in-memory store for rate limiting (replace with Redis/DB in prod)
const userUploadCounts: Record<string, { count: number; lastUpload: number }> = {};

export async function POST(request: NextRequest) {
  const user_id = request.headers.get("x-user-id");
  const user_email = request.headers.get("x-user-email");
  if (!user_id || !user_email) {
    return NextResponse.json({ error: "Missing user info" }, { status: 401 });
  }

  const now = Date.now();
  const userData = userUploadCounts[user_id] || { count: 0, lastUpload: 0 };
  if (userData.count >= RATE_LIMIT && now - userData.lastUpload < 60 * 60 * 1000) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  const formData = await request.formData();
  const files: File[] = [];
  for (const entry of formData.entries()) {
    const [key, value] = entry;
    if (value instanceof File) files.push(value);
  }
  if (files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 });
  }
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type: ${file.name}` }, { status: 400 });
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 });
    }
  }

  const fileAttachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
    }))
  );

  const emailResult = await sendPrintMediaOCREmail(user_email, user_id, fileAttachments);
  if (!emailResult.success) {
    console.error("Failed to send Print Media OCR email:", emailResult.message);
    return NextResponse.json({ error: "Failed to send notification email" }, { status: 500 });
  }

  userUploadCounts[user_id] = {
    count: userData.count + 1,
    lastUpload: now,
  };

  const jobId = `ocr_${user_id}_${now}`;
  return NextResponse.json({ jobId, status: "queued" });
}

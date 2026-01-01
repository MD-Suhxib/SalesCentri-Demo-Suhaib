import { NextRequest, NextResponse } from "next/server";

// Dummy in-memory job status store (replace with DB in prod)
const jobStatusStore: Record<string, { status: string; progress: number }> = {};

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }
  const job = jobStatusStore[jobId] || { status: "queued", progress: 0 };
  return NextResponse.json(job);
}

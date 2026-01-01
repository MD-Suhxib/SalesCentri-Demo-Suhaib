"use client";

/**
 * Lightning Mode session utilities
 * - Clears only Lightning/session scoped cookies and storage
 * - Initializes a fresh Lightning session id
 */

const LIGHTNING_PREFIXES = ["lightning_", "session_"];
const SESSION_ID_KEY = "lightning_session_id";

function safeRun(fn: () => void): void {
  try {
    fn();
  } catch {
    // no-op: best-effort cleanup; avoid throwing in render path
  }
}

function shouldClearKey(key: string): boolean {
  return LIGHTNING_PREFIXES.some((p) => key.startsWith(p));
}

function clearPrefixedStorage(storage: Storage): void {
  // Iterate over keys snapshot to avoid live mutation issues
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (key) keys.push(key);
  }
  keys.forEach((key) => {
    if (shouldClearKey(key)) {
      storage.removeItem(key);
    }
  });
}

function getAllCookieNames(): string[] {
  if (typeof document === "undefined") return [];
  const raw = document.cookie || "";
  return raw
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => c.split("=")[0]);
}

function clearPrefixedCookies(): void {
  if (typeof document === "undefined") return;
  const names = getAllCookieNames();
  names.forEach((name) => {
    if (!shouldClearKey(name)) return;
    // Expire cookie across common paths; domain scoping is omitted to avoid nuking unrelated subdomains
    const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `${name}=; expires=${expires}; path=/`;
  });
}

function generateSessionId(): string {
  const rand = Math.random().toString(36).slice(2);
  return `lightning_${Date.now()}_${rand}`;
}

function initSessionId(): string {
  if (typeof window === "undefined") return "";
  // Prefer sessionStorage for per-tab freshness
  let id = sessionStorage.getItem(SESSION_ID_KEY) || "";
  if (!id) {
    id = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

export function getLightningSessionId(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(SESSION_ID_KEY) || "";
}

export function resetLightningSession(): string {
  if (typeof window === "undefined") return "";

  // Clear scoped cookies and storage
  safeRun(() => clearPrefixedCookies());
  safeRun(() => clearPrefixedStorage(localStorage));
  safeRun(() => clearPrefixedStorage(sessionStorage));

  // Initialize a fresh session id (per tab)
  const sessionId = initSessionId();

  // Persist the session id in a cookie scoped to path=/ for optional backend correlation
  safeRun(() => {
    const maxAge = 60 * 60; // 1 hour
    document.cookie = `${SESSION_ID_KEY}=${sessionId}; path=/; max-age=${maxAge}`;
  });

  return sessionId;
}



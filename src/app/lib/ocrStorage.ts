/**
 * OCR Storage Utility
 * Handles saving, loading, and managing OCR job data
 * with automatic expiration and persistent UI state
 */

export type OCRJobStatus = "queued" | "processing" | "complete";

export interface OCRJobMetadata {
  jobId: string;
  savedAt: number;
  expiresAt: number;
  status: OCRJobStatus;
  fileCount: number;
  progress: number;
}

export interface OCRJobDraft {
  metadata: OCRJobMetadata;
  files: string[]; // file names or URLs
}

const OCR_STORAGE_KEY = "salescentri_ocr_job";
const OCR_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

export function saveOCRJobDraft(draft: OCRJobDraft): boolean {
  try {
    localStorage.setItem(OCR_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch (error) {
    console.error("Failed to save OCR job draft:", error);
    return false;
  }
}

export function loadOCRJobDraft(): OCRJobDraft | null {
  try {
    const stored = localStorage.getItem(OCR_STORAGE_KEY);
    if (!stored) return null;
    const draft: OCRJobDraft = JSON.parse(stored);
    if (draft.metadata.expiresAt < Date.now()) {
      clearOCRJobDraft();
      return null;
    }
    return draft;
  } catch (error) {
    console.error("Failed to load OCR job draft:", error);
    return null;
  }
}

export function clearOCRJobDraft(): void {
  try {
    localStorage.removeItem(OCR_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear OCR job draft:", error);
  }
}

export function hasOCRJobDraft(): boolean {
  return loadOCRJobDraft() !== null;
}

export function getOCRJobMetadata(): OCRJobMetadata | null {
  const draft = loadOCRJobDraft();
  return draft?.metadata ?? null;
}

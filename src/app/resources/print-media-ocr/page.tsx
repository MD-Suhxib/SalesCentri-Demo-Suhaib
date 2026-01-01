"use client";

import { useEffect, useRef, useState } from "react";
import { checkAuthQuick, getUserProfile } from "@/app/lib/auth";
import {
  saveOCRJobDraft,
  loadOCRJobDraft,
  clearOCRJobDraft,
  OCRJobDraft,
} from "@/app/lib/ocrStorage";
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

const MAX_FILES = 60;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_MB = 10;

function validateFiles(files: File[]): string | null {
  if (files.length > MAX_FILES) return `Maximum ${MAX_FILES} files allowed.`;
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) return `Invalid file type: ${file.name}`;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `File too large: ${file.name}`;
  }
  return null;
}

export default function PrintMediaOCRPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(checkAuthQuick());
  }, []);

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle"|"queued"|"processing"|"complete">("idle");
  const [confirmation, setConfirmation] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load persisted job state on mount
  useEffect(() => {
    const draft = loadOCRJobDraft();
    if (draft) {
      setFiles([]);
      setProgress(draft.metadata.progress);
      setStatus(draft.metadata.status);
      setJobId(draft.metadata.jobId);
      setConfirmation(draft.metadata.status === "complete");
      if (draft.metadata.status !== "complete") {
        startStatusPolling(draft.metadata.jobId);
      }
    }
  }, []);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const allFiles = [...files, ...droppedFiles];
    const validation = validateFiles(allFiles);
    if (validation) {
      setError(validation);
      return;
    }
    setFiles(allFiles);
    setError(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const allFiles = [...files, ...selectedFiles];
    const validation = validateFiles(allFiles);
    if (validation) {
      setError(validation);
      return;
    }
    setFiles(allFiles);
    setError(null);
  }

  function removeFile(idx: number) {
    setFiles(files.filter((_, i) => i !== idx));
  }

  // Poll status from API
  function startStatusPolling(jobId: string) {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/print-media-ocr/status?jobId=${jobId}`);
        const data = await response.json();
        if (data.status) {
          setStatus(data.status);
          setProgress(data.progress || 0);

          const draft = loadOCRJobDraft();
          if (draft) {
            draft.metadata.status = data.status;
            draft.metadata.progress = data.progress || 0;
            saveOCRJobDraft(draft);
          }

          if (data.status === "complete") {
            clearInterval(pollInterval);
            setConfirmation(true);
          }
        }
      } catch (error) {
        console.error("Failed to poll status:", error);
      }
    }, 3000);
    return () => clearInterval(pollInterval);
  }

  async function handleUpload() {
    if (!isAuthenticated) {
      window.location.href = "https://dashboard.salescentri.com/login?redirect=/resources/print-media-ocr";
      return;
    }

    setUploading(true);
    setProgress(0);
    setStatus("queued");
    setError(null);

    try {
      const profile = await getUserProfile();
      if (!profile) {
        setError("Failed to get user profile. Please log in again.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/print-media-ocr/upload", {
        method: "POST",
        headers: {
          "x-user-id": profile.user.id.toString(),
          "x-user-email": profile.user.email,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Upload failed");
        setUploading(false);
        return;
      }

      const result = await response.json();
      const newJobId = result.jobId;
      setJobId(newJobId);
      setStatus(result.status || "queued");

      saveOCRJobDraft({
        metadata: {
          jobId: newJobId,
          savedAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
          status: "complete",
          fileCount: files.length,
          progress: 100,
        },
        files: files.map(f => f.name),
      });

      setStatus("complete");
      setProgress(100);
      setConfirmation(true);
      setUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-black py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-6 backdrop-blur-sm border border-blue-500/30">
              <FileText className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Print Media OCR
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Upload print media files, such as flyers, brochures, Business Cards, and receive parsed structured results.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              ⚡ Fast Processing • 🔒 Secure Upload • 📊 Structured Export
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8">
        {/* Upload Section */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 mb-10 shadow-2xl shadow-blue-900/20">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              Upload Your Files
            </h2>
            <p className="text-gray-400">Drag and drop or click to select up to 60 print media files</p>
          </div>

          <div
            className="group border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-2xl p-16 text-center cursor-pointer bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:from-blue-900/20 hover:to-purple-900/20 transition-all duration-500 relative overflow-hidden"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <input
              type="file"
              multiple
              accept=".pdf,image/jpeg,image/jpg,image/png"
              className="hidden"
              ref={inputRef}
              onChange={handleFileChange}
              aria-label="Upload print media files"
            />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <p className="text-xl font-semibold text-gray-200 mb-3 group-hover:text-white transition-colors">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Supported formats: PDF, JPG, PNG
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Max 60 files
                </span>
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> 10MB per file
                </span>
              </div>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-3 p-5 mt-6 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/50 rounded-xl text-red-300 backdrop-blur-sm">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Selected Files</h3>
                    <p className="text-sm text-gray-400">{files.length} file{files.length !== 1 ? 's' : ''} ready to upload</p>
                  </div>
                </div>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-900/20"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-800/30 hover:from-gray-700/60 hover:to-gray-700/30 rounded-xl px-5 py-4 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      className="ml-4 text-xs font-medium text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-red-900/30 transition-all duration-200 flex-shrink-0"
                      onClick={e => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            className="w-full mt-8 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 text-white font-semibold px-8 py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-900/50 hover:shadow-blue-800/50 hover:scale-[1.02] active:scale-[0.98] group"
            disabled={files.length === 0 || uploading}
            onClick={handleUpload}
          >
            {uploading ? (
              <>
                <Clock className="w-6 h-6 animate-spin" />
                <span className="text-lg">Processing...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Upload & Start Processing</span>
              </>
            )}
          </button>
        </div>
        {/* Progress Section */}
        {uploading && (
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 mb-10 shadow-2xl shadow-purple-900/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center animate-pulse">
                <Clock className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Processing Your Upload</h3>
                <p className="text-gray-400 text-sm">Please wait while we process your files</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">Upload Progress</span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {progress}%
                </span>
              </div>
              <div className="relative w-full bg-gray-800/60 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                <div
                  className="relative h-full bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/50"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Status:</span>
                  <span className="text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FileText className="w-4 h-4" />
                  {files.length} file{files.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Confirmation Section */}
        {confirmation && (
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 backdrop-blur-xl border border-green-500/40 rounded-3xl p-10 shadow-2xl shadow-green-900/30 animate-fadeIn">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounce">
                <CheckCircle className="w-9 h-9 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-400 mb-3">
                  🎉 Batch Received Successfully!
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  We've received your batch and started processing. You will receive structured results within <span className="font-semibold text-white">24 working hours</span>.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/40 rounded-xl px-4 py-3 border border-gray-700/50">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span>Expected delivery: Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="group bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-900/20">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-bold text-white text-lg mb-3">Easy Upload</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Drag & drop or click to upload PDF files or images. Support for multiple formats.
            </p>
          </div>
          <div className="group bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-900/20">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-lg mb-3">Fast Processing</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Receive parsed structured data within 24 working hours via email.
            </p>
          </div>
          <div className="group bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-green-500/50 rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-900/20">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-bold text-white text-lg mb-3">Structured Output</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Get organized data in CSV and Excel formats, ready to import into CRMs and analytics tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

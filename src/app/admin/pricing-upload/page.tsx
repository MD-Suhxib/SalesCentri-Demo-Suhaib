'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/get-pricing', { cache: 'no-store' });
        const json = await res.json();
        if (json?.updatedAt) setUpdatedAt(json.updatedAt);
      } catch {}
    })();
  }, []);

  // Admin-only access for uploading pricing data
  useEffect(() => {
    (async () => {
      try {
        // Check if we're on the client side
        if (typeof window === 'undefined') {
          return;
        }

        // Get token from localStorage
        const token = localStorage.getItem('salescentri_token');
        if (!token) {
          setStatus('Please log in to upload pricing data. Redirecting to home…');
          router.replace('/');
          return;
        }

        const res = await fetch('https://app.demandintellect.com/app/api/profile.php', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          cache: 'no-store',
        });
        if (res.status !== 200) {
          setStatus('Please log in to upload pricing data. Redirecting to home…');
          router.replace('/');
          return;
        }
        // Check if user has admin role
        const profile = await res.json();
        if (profile?.user?.role === 'admin') {
          setIsAuthorized(true);
          setStatus('Ready to upload pricing data (Admin Access)');
        } else {
          setStatus('Access denied. Admin role required to upload pricing data. Redirecting...');
          setTimeout(() => router.replace('/'), 2000);
        }
      } catch (error) {
        setStatus('Please log in to upload pricing data. Redirecting to home…');
        router.replace('/');
      }
      finally {
        setIsChecking(false);
      }
    })();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a .xlsx file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    setStatus('Uploading...');
    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        setStatus('Please try again.');
        setIsUploading(false);
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem('salescentri_token');
      if (!token) {
        setStatus('Please log in to upload pricing data.');
        setIsUploading(false);
        return;
      }

      const res = await fetch('/api/upload-pricing', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setStatus('Please log in.');
        } else if (res.status === 403) {
          setStatus('Access denied. Admin role required.');
        } else if (res.status === 503) {
          setStatus('Authentication service unavailable. Please try again.');
        } else if (res.status === 504) {
          setStatus('Authentication timeout. Please try again.');
        } else {
          setStatus(json?.error || 'Upload failed.');
        }
      } else {
        setStatus(`Upload successful. ${json.count ?? 0} rows processed.`);
        setUpdatedAt(json.updatedAt ?? null);
      }
    } catch (err) {
      setStatus('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black text-white px-6 sm:px-12 lg:px-32 pt-28 pb-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Pricing Upload</h1>
          <p className="text-sm text-gray-400">Checking access…</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 sm:px-12 lg:px-32 pt-28 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Pricing Upload (Admin Only)</h1>
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Admin Access Required:</strong> Only users with admin role can upload and update pricing data. 
            Pricing data is publicly accessible for viewing subscription plans.
          </p>
        </div>
        {updatedAt && (
          <p className="text-sm text-gray-400 mb-6">Last updated: {new Date(updatedAt).toLocaleString()}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-6 bg-gray-900/60 border border-gray-800 rounded-xl p-6">
          {/* Admin token UI removed: auth uses dashboard Bearer token */}
          <div>
            <label htmlFor="pricing-file" className="block text-sm font-medium mb-2">Excel file (.xlsx)</label>
            <input
              type="file"
              accept=".xlsx"
              id="pricing-file"
              title="Upload pricing Excel (.xlsx)"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isUploading}
              className={`px-6 py-3 rounded-lg font-semibold ${isUploading ? 'bg-gray-700 text-gray-400' : 'bg-blue-600 hover:bg-blue-500'} transition-colors`}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            {status && <span className="text-sm text-gray-300">{status}</span>}
          </div>
        </form>

        <div className="mt-8 text-sm text-gray-400">
          <p>Expected columns:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Segment (Personal | Business)</li>
            <li>Billing Cycle (Monthly | Yearly)</li>
            <li>Plan Name</li>
            <li>Credits</li>
            <li>Tagline</li>
            <li>Price (USD) (number or Custom/Flexible)</li>
            <li>AI Hunter Searches</li>
            <li>Contact Validations</li>
            <li>Additional Features (comma separated)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



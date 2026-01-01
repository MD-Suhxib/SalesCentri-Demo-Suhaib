'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Download,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
} from 'lucide-react';

interface PartnerApplication {
  id: string;
  partnershipType: string;
  country: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  partnerDetails: {
    companyLegalName?: string;
    companyName?: string;
    website?: string;
    registeredAddress?: string;
    contactPersonName: string;
    contactPersonEmail: string;
    contactPersonPhone: string;
    taxId: string;
    bankAccount?: string;
  };
  documents?: Record<string, { fileName: string; fileUrl: string }>;
  createdAt: any;
  updatedAt: any;
}

function PartnerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<PartnerApplication | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    } else {
      setError('No application ID provided');
      setLoading(false);
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/partner/register?applicationId=${applicationId}`);
      const result = await response.json();

      if (result.success) {
        setApplication(result.application);
      } else {
        setError(result.error || 'Failed to load application');
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
      submitted: {
        label: 'Submitted',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        icon: Clock,
      },
      'under-review': {
        label: 'Under Review',
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        icon: Clock,
      },
      approved: {
        label: 'Approved',
        color: 'bg-green-500/20 text-green-400 border-green-500/50',
        icon: CheckCircle,
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-500/20 text-red-400 border-red-500/50',
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.submitted;
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${config.color}`}>
        <Icon className="w-5 h-5" />
        <span className="font-semibold">{config.label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Application</h2>
          <p className="text-gray-400 mb-6">{error || 'Application not found'}</p>
          <Link
            href="/demo/market-place/partners/register"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Registration</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <section className="pt-32 pb-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <Link
              href="/login-portal"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Selection</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Partner{' '}
                  <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className="text-lg text-gray-300">Application ID: {application.id}</p>
              </div>
              <div className="mt-4 md:mt-0">
                {getStatusBadge(application.status)}
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          {application.status === 'submitted' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Registration Submitted Successfully!</h3>
                  <p className="text-gray-300 mb-4">
                    Thank you for your interest in partnering with us. Your application has been received and is currently under review.
                  </p>
                  <p className="text-sm text-gray-400">
                    We'll notify you at <span className="text-green-400 font-medium">{application.partnerDetails.contactPersonEmail}</span> once the review is complete.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Partnership Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-green-400" />
                  Partnership Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Partnership Type</p>
                    <p className="text-lg font-medium text-white">{application.partnershipType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Country</p>
                    <p className="text-lg font-medium text-white">{application.country}</p>
                  </div>
                </div>
              </motion.div>

              {/* Company Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">Company Details</h2>

                <div className="space-y-4">
                  {application.partnerDetails.companyLegalName && (
                    <div className="flex items-start space-x-3">
                      <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Legal Name</p>
                        <p className="text-white">{application.partnerDetails.companyLegalName}</p>
                      </div>
                    </div>
                  )}

                  {application.partnerDetails.companyName && (
                    <div className="flex items-start space-x-3">
                      <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Brand Name</p>
                        <p className="text-white">{application.partnerDetails.companyName}</p>
                      </div>
                    </div>
                  )}

                  {application.partnerDetails.website && (
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Website</p>
                        <a
                          href={application.partnerDetails.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          {application.partnerDetails.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {application.partnerDetails.registeredAddress && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Registered Address</p>
                        <p className="text-white">{application.partnerDetails.registeredAddress}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Tax ID</p>
                      <p className="text-white">{application.partnerDetails.taxId}</p>
                    </div>
                  </div>

                  {application.partnerDetails.bankAccount && (
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Bank Account</p>
                        <p className="text-white">{application.partnerDetails.bankAccount}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Contact Person</p>
                      <p className="text-white">{application.partnerDetails.contactPersonName}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a
                        href={`mailto:${application.partnerDetails.contactPersonEmail}`}
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        {application.partnerDetails.contactPersonEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <a
                        href={`tel:${application.partnerDetails.contactPersonPhone}`}
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        {application.partnerDetails.contactPersonPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Documents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-400" />
                  Uploaded Documents
                </h2>

                {application.documents && Object.keys(application.documents).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(application.documents).map(([docId, doc]) => (
                      <div
                        key={docId}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">{docId}</p>
                            <p className="text-sm text-gray-400">{doc.fileName}</p>
                          </div>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>View</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No documents uploaded</p>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="sticky top-24 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Application Timeline</h3>

                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-green-500">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-green-400">Submitted</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(application.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className={`relative pl-6 border-l-2 ${application.status === 'under-review' || application.status === 'approved' || application.status === 'rejected' ? 'border-green-500' : 'border-gray-700'}`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${application.status === 'under-review' || application.status === 'approved' || application.status === 'rejected' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    <div>
                      <p className={`text-sm font-medium ${application.status === 'under-review' || application.status === 'approved' || application.status === 'rejected' ? 'text-green-400' : 'text-gray-400'}`}>
                        Under Review
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {application.status === 'under-review' || application.status === 'approved' || application.status === 'rejected' ? 'In progress' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  <div className={`relative pl-6 border-l-2 ${application.status === 'approved' || application.status === 'rejected' ? 'border-green-500' : 'border-gray-700'}`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${application.status === 'approved' ? 'bg-green-500' : application.status === 'rejected' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                    <div>
                      <p className={`text-sm font-medium ${application.status === 'approved' ? 'text-green-400' : application.status === 'rejected' ? 'text-red-400' : 'text-gray-400'}`}>
                        {application.status === 'approved' ? 'Approved' : application.status === 'rejected' ? 'Rejected' : 'Decision'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {application.status === 'approved' || application.status === 'rejected' ? 'Completed' : 'Pending review'}
                      </p>
                    </div>
                  </div>
                </div>

                {application.status === 'submitted' && (
                  <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-gray-300">
                      Your application is being reviewed. We'll contact you within 3-5 business days.
                    </p>
                  </div>
                )}

                {application.status === 'approved' && (
                  <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-gray-300">
                      Congratulations! Your partnership has been approved. Check your email for next steps.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PartnerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <PartnerDashboardContent />
    </Suspense>
  );
}

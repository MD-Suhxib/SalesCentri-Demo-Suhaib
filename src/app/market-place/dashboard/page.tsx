'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  FileText,
  Building2,
  Calendar,
  HelpCircle,
  Eye,
  Upload,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

type ApplicationStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Live';

interface TimelineEvent {
  status: ApplicationStatus;
  date: string;
  description: string;
  completed: boolean;
}

interface Document {
  id: string;
  name: string;
  status: 'uploaded' | 'pending' | 'rejected';
  uploadedAt?: string;
  rejectionReason?: string;
}

export default function MarketplaceDashboardPage() {
  // Mock data - in production, this would come from an API
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>('Under Review');
  const [progress, setProgress] = useState(60); // Percentage

  const timeline: TimelineEvent[] = [
    {
      status: 'Draft',
      date: '2024-01-15',
      description: 'Application saved as draft',
      completed: true,
    },
    {
      status: 'Submitted',
      date: '2024-01-20',
      description: 'Application submitted for review',
      completed: true,
    },
    {
      status: 'Under Review',
      date: '2024-01-21',
      description: 'Application is being reviewed by our team',
      completed: true,
    },
    {
      status: 'Approved',
      date: '',
      description: 'Application approved and profile activated',
      completed: false,
    },
    {
      status: 'Live',
      date: '',
      description: 'Your profile is live on the marketplace',
      completed: false,
    },
  ];

  const documents: Document[] = [
    {
      id: '1',
      name: 'Certificate of Incorporation',
      status: 'uploaded',
      uploadedAt: '2024-01-20',
    },
    {
      id: '2',
      name: 'PAN Card',
      status: 'uploaded',
      uploadedAt: '2024-01-20',
    },
    {
      id: '3',
      name: 'GST Certificate',
      status: 'uploaded',
      uploadedAt: '2024-01-20',
    },
    {
      id: '4',
      name: 'MOA & AOA',
      status: 'uploaded',
      uploadedAt: '2024-01-20',
    },
    {
      id: '5',
      name: 'Director ID (DIN)',
      status: 'pending',
    },
    {
      id: '6',
      name: 'Address Proof',
      status: 'rejected',
      uploadedAt: '2024-01-20',
      rejectionReason: 'Document is not clear. Please upload a higher resolution copy.',
    },
  ];

  const companyDetails = {
    companyName: 'Acme Corporation Pvt Ltd',
    companyType: 'Private Limited Company (Pvt Ltd)',
    businessType: 'Supplier',
    region: 'India',
    registeredAddress: '123 Business Street, Mumbai, Maharashtra 400001',
    contactPerson: 'John Doe',
    businessEmail: 'contact@acmecorp.com',
    businessPhone: '+91 98765 43210',
    taxId: 'ABCDE1234F',
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-500';
      case 'Submitted':
        return 'bg-blue-500';
      case 'Under Review':
        return 'bg-yellow-500';
      case 'Approved':
        return 'bg-green-500';
      case 'Live':
        return 'bg-green-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'Draft':
        return <FileText className="w-5 h-5" />;
      case 'Submitted':
        return <Upload className="w-5 h-5" />;
      case 'Under Review':
        return <Clock className="w-5 h-5" />;
      case 'Approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'Live':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getDocumentStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(122,92,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Marketplace Application Dashboard</h1>
            <p className="text-gray-400">Track your application status and manage your marketplace profile</p>
          </motion.div>

          {/* Application Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 mb-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Application Status</h2>
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getStatusColor(
                      applicationStatus
                    )} bg-opacity-20 border border-${getStatusColor(applicationStatus)}`}
                  >
                    {getStatusIcon(applicationStatus)}
                    <span className="text-white font-medium">{applicationStatus}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Progress</p>
                <p className="text-2xl font-bold text-white">{progress}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-3 rounded-full ${getStatusColor(applicationStatus)}`}
              />
            </div>

            {/* Current Stage Display */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">Current Stage</p>
              <p className="text-white font-medium">
                {applicationStatus === 'Under Review'
                  ? 'Your application is being reviewed by our verification team. This typically takes 3-5 business days.'
                  : applicationStatus === 'Submitted'
                  ? 'Your application has been submitted successfully. Our team will begin review shortly.'
                  : applicationStatus === 'Approved'
                  ? 'Congratulations! Your application has been approved. Your profile will be activated soon.'
                  : applicationStatus === 'Live'
                  ? 'Your profile is live on the marketplace. You can now start connecting with buyers/suppliers.'
                  : 'Your application is saved as draft. Complete and submit when ready.'}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Application Timeline</span>
              </h2>
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {event.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            event.completed ? 'bg-blue-500' : 'bg-gray-700'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-semibold ${
                            event.completed ? 'text-white' : 'text-gray-400'
                          }`}
                        >
                          {event.status}
                        </h3>
                        {event.date && (
                          <span className="text-sm text-gray-500">{event.date}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Company Details Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Company Details</span>
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Company Name</p>
                  <p className="text-sm text-white font-medium">{companyDetails.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Company Type</p>
                  <p className="text-sm text-white">{companyDetails.companyType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Business Type</p>
                  <p className="text-sm text-white">{companyDetails.businessType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Region</p>
                  <p className="text-sm text-white">{companyDetails.region}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Contact Person</p>
                  <p className="text-sm text-white">{companyDetails.contactPerson}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <p className="text-sm text-white">{companyDetails.businessEmail}</p>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  Edit Details
                </button>
              </div>
            </motion.div>
          </div>

          {/* Documents List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Documents</span>
              </h2>
              <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1">
                <Upload className="w-4 h-4" />
                <span>Replace Document</span>
              </button>
            </div>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getDocumentStatusIcon(doc.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{doc.name}</p>
                      {doc.uploadedAt && (
                        <p className="text-xs text-gray-400">Uploaded: {doc.uploadedAt}</p>
                      )}
                      {doc.rejectionReason && (
                        <p className="text-xs text-red-400 mt-1">{doc.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.status === 'uploaded' && (
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {doc.status === 'rejected' && (
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Re-upload
                      </button>
                    )}
                    {doc.status === 'pending' && (
                      <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Support/Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-800/30 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  If you have questions about your application or need assistance, our support team is here to help.
                </p>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Contact Support
                  </button>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    View FAQ
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


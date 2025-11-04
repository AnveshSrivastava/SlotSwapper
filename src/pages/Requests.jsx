import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight, Check, X, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { mockGetSwapRequests, mockRespondToSwapRequest } from '../utils/mockData';

const Requests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await mockGetSwapRequests();
      setIncoming(data.incoming);
      setOutgoing(data.outgoing);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, accept) => {
    try {
      await mockRespondToSwapRequest(requestId, accept);
      toast.success(accept ? 'Swap accepted!' : 'Swap rejected');
      await loadRequests();
    } catch (error) {
      toast.error('Failed to respond to request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const STATUS_BADGE = {
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    ACCEPTED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
          <p className="text-gray-600 mt-1">Review and manage your swap requests</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-xl shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`relative px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'incoming'
                ? 'text-teal-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {activeTab === 'incoming' && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-teal-50 rounded-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              Incoming {incoming.length > 0 && `(${incoming.length})`}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`relative px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'outgoing'
                ? 'text-teal-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {activeTab === 'outgoing' && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-teal-50 rounded-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              Outgoing {outgoing.length > 0 && `(${outgoing.length})`}
            </span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'incoming' && (
          <div>
            {incoming.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-12 text-center shadow-sm"
              >
                <div className="inline-flex bg-gray-100 rounded-full p-6 mb-4">
                  <Inbox className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No incoming requests</h3>
                <p className="text-gray-600">When others request to swap with you, they'll appear here</p>
              </motion.div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {incoming.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">{request.requesterName}</span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">They offer:</p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-sm text-gray-900">{request.offeredSlot?.title}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(request.offeredSlot?.startTime), 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-teal-600" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">For your:</p>
                        <div className="bg-teal-50 rounded-lg p-3">
                          <p className="font-medium text-sm text-gray-900">{request.requestedSlot?.title}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(request.requestedSlot?.startTime), 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {request.status === 'PENDING' ? (
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRespond(request.id, false)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span className="text-sm font-medium">Reject</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRespond(request.id, true)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Accept</span>
                        </motion.button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                            STATUS_BADGE[request.status].bg
                          } ${STATUS_BADGE[request.status].text}`}
                        >
                          {STATUS_BADGE[request.status].label}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'outgoing' && (
          <div>
            {outgoing.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-12 text-center shadow-sm"
              >
                <div className="inline-flex bg-gray-100 rounded-full p-6 mb-4">
                  <Inbox className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No outgoing requests</h3>
                <p className="text-gray-600">Visit the Marketplace to request swaps</p>
              </motion.div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {outgoing.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">Your request</span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          STATUS_BADGE[request.status].bg
                        } ${STATUS_BADGE[request.status].text}`}
                      >
                        {STATUS_BADGE[request.status].label}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">You offered:</p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-sm text-gray-900">{request.offeredSlot?.title}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(request.offeredSlot?.startTime), 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-teal-600" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">For:</p>
                        <div className="bg-teal-50 rounded-lg p-3">
                          <p className="font-medium text-sm text-gray-900">{request.requestedSlot?.title}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(request.requestedSlot?.startTime), 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import SwapModal from '../components/SwapModal';
import { mockGetSwappableSlots } from '../utils/mockData';

const Marketplace = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const data = await mockGetSwappableSlots();
      setSlots(data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
    } catch (error) {
      toast.error('Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot) => {
    setSelectedSlot(slot);
    setIsSwapModalOpen(true);
  };

  const handleSwapSuccess = async () => {
    setIsSwapModalOpen(false);
    setSelectedSlot(null);
    await loadSlots();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-1">Browse and request swaps for available time slots</p>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 flex items-start space-x-3"
        >
          <AlertCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-teal-800">
              <strong>Tip:</strong> Mark your events as "Swappable" in the Dashboard to make them
              available for swap requests. You need at least one swappable event to request swaps.
            </p>
          </div>
        </motion.div>

        {/* Slots Grid */}
        {slots.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm"
          >
            <div className="inline-flex bg-gray-100 rounded-full p-6 mb-4">
              <ArrowRightLeft className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No slots available</h3>
            <p className="text-gray-600">Check back later for available time slots to swap</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{slot.title}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {format(new Date(slot.startTime), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 ml-6">
                      {format(new Date(slot.startTime), 'h:mm a')} -{' '}
                      {format(new Date(slot.endTime), 'h:mm a')}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600 pt-2">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span>{slot.ownerName}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRequestSwap(slot)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  <span>Request Swap</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Swap Modal */}
      {selectedSlot && (
        <SwapModal
          isOpen={isSwapModalOpen}
          onClose={() => {
            setIsSwapModalOpen(false);
            setSelectedSlot(null);
          }}
          targetSlot={selectedSlot}
          onSuccess={handleSwapSuccess}
        />
      )}
    </div>
  );
};

export default Marketplace;
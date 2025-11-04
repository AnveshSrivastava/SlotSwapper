import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { mockGetEvents, mockCreateSwapRequest } from '../utils/mockData';

const SwapModal = ({ isOpen, onClose, targetSlot, onSuccess }) => {
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMySlots();
    }
  }, [isOpen]);

  const loadMySlots = async () => {
    try {
      const events = await mockGetEvents();
      const swappable = events.filter(e => e.status === 'SWAPPABLE');
      setMySlots(swappable);
    } catch (error) {
      toast.error('Failed to load your slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlotId) {
      toast.error('Please select a slot to offer');
      return;
    }

    setSubmitting(true);
    try {
      await mockCreateSwapRequest(selectedSlotId, targetSlot.id);
      toast.success('Swap request sent!');
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to create swap request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Request Swap</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Target Slot Info */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-teal-900 mb-2">You want to swap for:</p>
              <h3 className="font-semibold text-gray-900 mb-2">{targetSlot.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Clock className="h-4 w-4" />
                <span>
                  {format(new Date(targetSlot.startTime), 'MMM d, yyyy')} at{' '}
                  {format(new Date(targetSlot.startTime), 'h:mm a')}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : mySlots.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <AlertCircle className="h-10 w-10 text-amber-600 mx-auto mb-3" />
                <p className="text-sm text-amber-800 font-medium mb-2">
                  No swappable slots available
                </p>
                <p className="text-xs text-amber-700">
                  Mark one of your events as "Swappable" in the Dashboard first.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select your slot to offer:
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {mySlots.map((slot) => (
                      <label
                        key={slot.id}
                        className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedSlotId === slot.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.id}
                          checked={selectedSlotId === slot.id}
                          onChange={(e) => setSelectedSlotId(e.target.value)}
                          className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-semibold text-gray-900">{slot.title}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(new Date(slot.startTime), 'MMM d, h:mm a')}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={submitting || !selectedSlotId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : 'Send Request'}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SwapModal;
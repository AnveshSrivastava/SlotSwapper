import React from 'react';
import { Clock, Edit, Trash2, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const STATUS_STYLES = {
  BUSY: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    label: 'Busy'
  },
  SWAPPABLE: {
    bg: 'bg-teal-100',
    text: 'text-teal-700',
    border: 'border-teal-300',
    label: 'Swappable'
  },
  SWAP_PENDING: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
    label: 'Swap Pending'
  }
};

const EventCard = ({ event, onEdit, onDelete, onToggleSwappable }) => {
  const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.BUSY;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {format(new Date(event.startTime), 'MMM d, yyyy')} at{' '}
              {format(new Date(event.startTime), 'h:mm a')}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Ends: {format(new Date(event.endTime), 'MMM d, h:mm a')}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-xl text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
        >
          {statusStyle.label}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {event.status !== 'SWAP_PENDING' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(event)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span className="text-sm font-medium">Edit</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleSwappable(event)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                event.status === 'SWAPPABLE'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-teal-100 hover:bg-teal-200 text-teal-700'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span className="text-sm font-medium">
                {event.status === 'SWAPPABLE' ? 'Mark Busy' : 'Mark Swappable'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(event)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </>
        )}
        {event.status === 'SWAP_PENDING' && (
          <div className="flex-1 text-center py-2 text-sm text-amber-700 bg-amber-50 rounded-xl">
            Swap request pending
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
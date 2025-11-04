import React, { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import {
  mockGetEvents,
  mockCreateEvent,
  mockUpdateEvent,
  mockDeleteEvent
} from '../utils/mockData';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await mockGetEvents();
      setEvents(data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await mockCreateEvent(eventData);
      toast.success('Event created successfully!');
      await loadEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to create event');
      throw error;
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await mockUpdateEvent(editingEvent.id, eventData);
      toast.success('Event updated successfully!');
      setEditingEvent(null);
      await loadEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to update event');
      throw error;
    }
  };

  const handleDeleteEvent = async (event) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await mockDeleteEvent(event.id);
      toast.success('Event deleted');
      await loadEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleToggleSwappable = async (event) => {
    try {
      const newStatus = event.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
      await mockUpdateEvent(event.id, { status: newStatus });
      toast.success(
        newStatus === 'SWAPPABLE' ? 'Event marked as swappable' : 'Event marked as busy'
      );
      await loadEvents();
    } catch (error) {
      toast.error('Failed to update event status');
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
              <p className="text-gray-600 mt-1">Manage your schedule and swap availability</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Create Event</span>
            </motion.button>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm"
          >
            <div className="inline-flex bg-gray-100 rounded-full p-6 mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-6">Create your first event to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Create Event</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditClick}
                onDelete={handleDeleteEvent}
                onToggleSwappable={handleToggleSwappable}
              />
            ))}
          </div>
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        event={editingEvent}
      />
    </div>
  );
};

export default Dashboard;
// Mock data for frontend-only implementation
// This will be replaced with actual API calls later

const STORAGE_KEYS = {
  TOKEN: 'SLOTSWAPPER_TOKEN',
  USER: 'SLOTSWAPPER_USER',
  EVENTS: 'SLOTSWAPPER_EVENTS',
  SWAP_REQUESTS: 'SLOTSWAPPER_SWAP_REQUESTS'
};

// Sample users for mock
const MOCK_USERS = [
  { id: 'user1', email: 'alice@example.com', name: 'Alice Johnson' },
  { id: 'user2', email: 'bob@example.com', name: 'Bob Smith' },
  { id: 'user3', email: 'charlie@example.com', name: 'Charlie Brown' }
];

// Initialize mock data in localStorage if not present
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    const mockEvents = [
      {
        id: 'evt1',
        userId: 'user1',
        title: 'Team Meeting',
        startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        endTime: new Date(Date.now() + 90000000).toISOString(),
        status: 'BUSY'
      },
      {
        id: 'evt2',
        userId: 'user1',
        title: 'Doctor Appointment',
        startTime: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        endTime: new Date(Date.now() + 176400000).toISOString(),
        status: 'SWAPPABLE'
      },
      {
        id: 'evt3',
        userId: 'user2',
        title: 'Gym Session',
        startTime: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        endTime: new Date(Date.now() + 262800000).toISOString(),
        status: 'SWAPPABLE'
      },
      {
        id: 'evt4',
        userId: 'user3',
        title: 'Dentist Visit',
        startTime: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
        endTime: new Date(Date.now() + 349200000).toISOString(),
        status: 'SWAPPABLE'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(mockEvents));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SWAP_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.SWAP_REQUESTS, JSON.stringify([]));
  }
};

// Auth functions
export const mockLogin = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  const user = MOCK_USERS.find(u => u.email === email);
  if (!user || password.length < 6) {
    throw new Error('Invalid credentials');
  }
  
  const token = `mock_token_${user.id}_${Date.now()}`;
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  
  return { user, token };
};

export const mockSignup = async (email, name, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!email || !name || password.length < 6) {
    throw new Error('Invalid input');
  }
  
  // Check if user already exists
  const existingUser = MOCK_USERS.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const newUser = {
    id: `user${Date.now()}`,
    email,
    name
  };
  
  MOCK_USERS.push(newUser);
  
  const token = `mock_token_${newUser.id}_${Date.now()}`;
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  
  return { user: newUser, token };
};

export const mockLogout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

// Event functions
export const mockGetEvents = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  initializeMockData();
  
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not authenticated');
  
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  return events.filter(e => e.userId === currentUser.id);
};

export const mockCreateEvent = async (eventData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not authenticated');
  
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  const newEvent = {
    id: `evt${Date.now()}`,
    userId: currentUser.id,
    ...eventData,
    status: eventData.status || 'BUSY'
  };
  
  events.push(newEvent);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  
  return newEvent;
};

export const mockUpdateEvent = async (eventId, updates) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not authenticated');
  
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  const index = events.findIndex(e => e.id === eventId && e.userId === currentUser.id);
  
  if (index === -1) throw new Error('Event not found');
  
  events[index] = { ...events[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  
  return events[index];
};

export const mockDeleteEvent = async (eventId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not authenticated');
  
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  const filtered = events.filter(e => !(e.id === eventId && e.userId === currentUser.id));
  
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered));
};

// Marketplace functions
export const mockGetSwappableSlots = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  initializeMockData();
  
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not authenticated');
  
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  const swappableEvents = events.filter(e => e.status === 'SWAPPABLE' && e.userId !== currentUser.id);
  
  // Add owner info
  return swappableEvents.map(event => {
    const owner = MOCK_USERS.find(u => u.id === event.userId) || { name: 'Unknown User' };
    return {
      ...event,
      ownerName: owner.name,
      ownerEmail: owner.email
    };
  });
};

// Swap request functions
export const mockCreateSwapRequest = async (mySlotId, theirSlotId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not authenticated');
  
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  const mySlot = events.find(e => e.id === mySlotId);
  const theirSlot = events.find(e => e.id === theirSlotId);
  
  if (!mySlot || !theirSlot) throw new Error('Invalid slots');
  if (mySlot.status !== 'SWAPPABLE') throw new Error('Your slot must be swappable');
  
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.SWAP_REQUESTS) || '[]');
  
  const newRequest = {
    id: `req${Date.now()}`,
    requesterId: currentUser.id,
    requesterName: currentUser.name,
    mySlotId,
    theirSlotId,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  
  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEYS.SWAP_REQUESTS, JSON.stringify(requests));
  
  // Update event statuses
  const eventIndex1 = events.findIndex(e => e.id === mySlotId);
  const eventIndex2 = events.findIndex(e => e.id === theirSlotId);
  events[eventIndex1].status = 'SWAP_PENDING';
  events[eventIndex2].status = 'SWAP_PENDING';
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  
  return newRequest;
};

export const mockGetSwapRequests = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  initializeMockData();
  
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not authenticated');
  
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.SWAP_REQUESTS) || '[]');
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  
  // Get incoming and outgoing requests
  const incoming = [];
  const outgoing = [];
  
  requests.forEach(req => {
    const theirSlot = events.find(e => e.id === req.theirSlotId);
    const mySlot = events.find(e => e.id === req.mySlotId);
    
    if (theirSlot && theirSlot.userId === currentUser.id) {
      // This is an incoming request
      incoming.push({
        ...req,
        requestedSlot: theirSlot,
        offeredSlot: mySlot
      });
    } else if (req.requesterId === currentUser.id) {
      // This is an outgoing request
      outgoing.push({
        ...req,
        requestedSlot: theirSlot,
        offeredSlot: mySlot
      });
    }
  });
  
  return { incoming, outgoing };
};

export const mockRespondToSwapRequest = async (requestId, accept) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not authenticated');
  
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.SWAP_REQUESTS) || '[]');
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  
  const requestIndex = requests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) throw new Error('Request not found');
  
  const request = requests[requestIndex];
  requests[requestIndex].status = accept ? 'ACCEPTED' : 'REJECTED';
  
  if (accept) {
    // Swap the event owners
    const event1Index = events.findIndex(e => e.id === request.mySlotId);
    const event2Index = events.findIndex(e => e.id === request.theirSlotId);
    
    if (event1Index !== -1 && event2Index !== -1) {
      const tempUserId = events[event1Index].userId;
      events[event1Index].userId = events[event2Index].userId;
      events[event2Index].userId = tempUserId;
      
      events[event1Index].status = 'BUSY';
      events[event2Index].status = 'BUSY';
    }
  } else {
    // Restore statuses to SWAPPABLE
    const event1Index = events.findIndex(e => e.id === request.mySlotId);
    const event2Index = events.findIndex(e => e.id === request.theirSlotId);
    
    if (event1Index !== -1) events[event1Index].status = 'SWAPPABLE';
    if (event2Index !== -1) events[event2Index].status = 'SWAPPABLE';
  }
  
  localStorage.setItem(STORAGE_KEYS.SWAP_REQUESTS, JSON.stringify(requests));
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  
  return requests[requestIndex];
};

export { STORAGE_KEYS, MOCK_USERS };
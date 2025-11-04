# SlotSwapper 🔄

A modern peer-to-peer time-slot scheduling platform that enables users to seamlessly swap calendar events with others.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## 📖 Overview

SlotSwapper is a full-stack web application that revolutionizes calendar management by allowing users to mark their events as swappable and exchange them with other users. Whether you need to reschedule a meeting or trade a class slot, SlotSwapper makes the process seamless and automated.

## 🏗️ Architecture Overview

The application follows a modern full-stack architecture:

- **Frontend**: Single-page application built with React and Vite
- **Backend**: RESTful API server using Node.js, Express, and TypeScript
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Authentication**: JWT-based secure authentication system

## 📁 Project Structure

```bash
SlotSwapper/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
│
└── backend-node/
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── middleware/    # Express middleware
    │   ├── routes/        # API route definitions
    │   ├── prisma/        # Database schema and migrations
    │   └── utils/         # Helper functions
    ├── prisma/           # Prisma configuration
    ├── package.json      # Backend dependencies
    └── tsconfig.json     # TypeScript configuration
```

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React | UI Library |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Axios | API Client |
| React Router | Navigation |
| Framer Motion | Animations |
| Lucide React | Icons |
| date-fns | Date Manipulation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web Framework |
| TypeScript | Language |
| Prisma | ORM |
| PostgreSQL | Database |
| JWT | Authentication |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v13 or higher)
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/AnveshSrivastava/SlotSwapper.git
cd SlotSwapper
```

2. **Backend Setup**
```bash
cd backend-node
npm install
cp .env.example .env  # Configure your environment variables
npx prisma migrate dev
npm run dev
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```

## ⚙️ Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/slotswapper"

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Server
PORT=3000
NODE_ENV="development"
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - List user's events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `GET /api/swappable-slots` - List available slots for swapping

### Swap Operations
- `POST /api/swap-request` - Create swap request
- `PUT /api/swap-response` - Accept/reject swap request

For detailed API documentation with request/response samples, see [API_DOCS.md](./API_DOCS.md)

## 📱 Frontend Pages

1. **Authentication**
   - Login
   - Signup
   - Password Recovery

2. **Dashboard**
   - Calendar View
   - Event Management
   - Swap Status

3. **Marketplace**
   - Available Slots
   - Filtering Options
   - Swap Request Form

4. **Requests**
   - Incoming Requests
   - Outgoing Requests
   - Request History

## 🎯 Design Decisions

- **JWT Authentication**: Chosen for stateless authentication and scalability
- **Prisma ORM**: Provides type safety and efficient database operations
- **State Synchronization**: Uses optimistic updates with backend validation
- **Component Architecture**: Follows atomic design principles for UI components

## 🔮 Future Enhancements

1. **Real-time Features**
   - WebSocket integration for live notifications
   - Real-time calendar updates

2. **Integration**
   - Google Calendar synchronization
   - Microsoft Outlook integration
   - Calendar export (iCal format)

3. **UI/UX Improvements**
   - Dark mode support
   - Mobile responsive design
   - Accessibility improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Developed with ❤️ by Anvesh Srivastava

---

[![GitHub stars](https://img.shields.io/github/stars/AnveshSrivastava/SlotSwapper)](https://github.com/AnveshSrivastava/SlotSwapper/stargazers)

Thank you for checking out SlotSwapper! Feel free to contribute or raise issues.

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

The repository is organized with the frontend (client) at the project root and the backend in the `backend-node` folder. Optional developer tooling and plugins live under `plugins`.

```bash
SlotSwapper/
├── src/                   # Frontend source (React + Vite)
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React context providers
   │   ├── hooks/          # Custom React hooks
│   ├── pages/             # Top-level pages (Dashboard, Marketplace, etc.)
│   └── utils/             # Utility functions
├── public/                # Static assets and index.html
├── package.json           # Frontend dependencies & scripts (dev/build)
├── vite.config.ts         # Vite configuration
├── craco.config.js        # Optional CRA/webpack overrides (used for dev tooling)
├── postcss.config.js      # Tailwind/PostCSS config
├── plugins/               # Optional dev plugins (visual-edits, health-check)
├── backend-node/          # Backend (Node + Express + Prisma)
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── prisma/        # Prisma schema & migrations
   ├── package.json       # Backend dependencies & scripts
├── README.md              # This file
└── tsconfig.json          # TypeScript config (frontend)
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

2. **Backend Setup** (API server)
```bash
cd backend-node
npm install
# Create or edit the backend `.env` file with your values. If you have an `.env.example`, copy it and update the values:
# cp .env.example .env
npx prisma migrate dev   # Run database migrations (creates DB schema)
npm run dev               # Start backend in dev mode (ts-node-dev)
```

3. **Frontend Setup** (UI client)
```bash
# From the repository root
npm install
npm run dev               # Starts Vite dev server (default port shown by Vite, e.g. http://localhost:5173)
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

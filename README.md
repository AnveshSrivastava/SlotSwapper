# SlotSwapper 🔄

A modern peer-to-peer time-slot scheduling platform that enables users to seamlessly swap calendar events with others.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GitHub stars](https://img.shields.io/github/stars/AnveshSrivastava/SlotSwapper)](https://github.com/AnveshSrivastava/SlotSwapper/stargazers)

## 📋 Table of Contents

SlotSwapper is a full-stack web application that revolutionizes calendar management by allowing users to mark their events as swappable and exchange them with other users. Whether you need to reschedule a meeting or trade a class slot, SlotSwapper makes the process seamless and automated.

## 🏗️ Architecture Overview

SlotSwapper is a full-stack web application that revolutionizes calendar management by allowing users to mark their events as swappable and exchange them with other users. The platform enables seamless peer-to-peer event swapping, making it easy to reschedule meetings, trade class slots, or exchange time commitments.

### User Flows

1. **Authentication**: Users sign up or log in to access their personalized calendar
2. **Event Management**: Users create events and mark them as `SWAPPABLE` to make them available for trading
3. **Marketplace Browsing**: Users browse available swappable slots from other users
4. **Swap Request**: Users initiate swap requests by selecting their slot and a target slot
5. **Swap Response**: The recipient accepts or rejects the swap request
6. **Automatic Ownership Transfer**: Upon acceptance, event ownership is automatically transferred via database transactions

### Key Design Decisions

#### **JWT Authentication**
- **Why**: Stateless authentication provides scalability and eliminates server-side session storage
- **Implementation**: JWT tokens expire after 7 days, with automatic verification on protected routes
- **Security**: Passwords are hashed using bcrypt with salt rounds of 10

#### **Prisma + PostgreSQL**
- **Why**: Type-safe database operations eliminate runtime errors and provide excellent developer experience
- **Benefits**: Automatic migrations, type inference, and efficient query building
- **Schema Location**: Prisma schema is located at `backend-node/src/prisma/schema.prisma` for better organization

#### **State Machine for Event Statuses**
- **Status Flow**: `BUSY` → `SWAPPABLE` → `SWAP_PENDING` → `BUSY` (after swap)
- **Validation**: Status transitions are strictly validated to prevent invalid state changes
- **Atomicity**: Status changes are wrapped in database transactions to ensure consistency

#### **Transaction Handling for Swaps**
- **Why**: Swaps involve multiple database operations (updating events, creating requests, transferring ownership)
- **Implementation**: All swap operations use Prisma transactions (`$transaction`) to ensure atomicity
- **Rollback**: If any operation fails, the entire transaction rolls back, maintaining data integrity

#### **Folder Layout**
- **Monorepo Structure**: Frontend at root, backend in `backend-node/` for clear separation
- **Prisma Schema**: Located in `src/prisma/` to keep schema alongside migrations
- **Route Organization**: Routes grouped by domain (auth, events, swaps) for maintainability

### Security & Data Integrity Highlights

- **Password Hashing**: bcrypt with 10 salt rounds for secure password storage
- **JWT Expiry**: Tokens expire after 7 days, requiring re-authentication
- **CORS Configuration**: Frontend URL whitelisted for cross-origin requests
- **Status Transition Validation**: Strict validation prevents invalid event status changes
- **Transaction Safety**: All swap operations use database transactions to prevent partial updates
- **Authorization Middleware**: JWT verification on all protected routes
- **Input Validation**: All endpoints validate required fields and data types

## 📁 Repository Structure

The repository follows a monorepo structure with the frontend at the root and backend in a dedicated folder:

```
SlotSwapper/
├── src/                      # Frontend source (React + Vite)
│   ├── components/           # Reusable UI components
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/            # React context providers (AuthContext)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Top-level pages
│   │   ├── Dashboard.jsx    # User's calendar view
│   │   ├── Marketplace.jsx  # Browse swappable slots
│   │   ├── Requests.jsx     # Swap requests management
│   │   ├── Login.jsx        # Authentication
│   │   └── Signup.jsx       # User registration
│   └── utils/               # Utility functions
├── public/                   # Static assets and index.html
├── backend-node/             # Backend (Node + Express + Prisma)
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── eventController.ts
│   │   │   └── swapController.ts
│   │   ├── routes/          # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── eventRoutes.ts
│   │   │   └── swapRoutes.ts
│   │   ├── middleware/      # Express middleware
│   │   │   └── authMiddleware.ts
│   │   ├── prisma/          # Prisma schema & migrations
│   │   │   └── schema.prisma
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration
│   │   ├── types/           # TypeScript types
│   │   ├── app.ts           # Express app setup
│   │   └── index.ts         # Server entry point
│   ├── prisma/              # Seed script location
│   │   └── seed.ts
│   ├── Dockerfile           # Backend container definition
│   └── package.json         # Backend dependencies
├── frontend/
│   └── Dockerfile           # Frontend container definition
├── docker-compose.yml       # Multi-container orchestration
├── package.json             # Frontend dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

**Important Notes**:
- **Root directory** (`/`): Contains frontend code (React + Vite)
- **Backend directory** (`/backend-node`): Contains backend code (Express + Prisma)
- **Frontend Dockerfile**: Located at `/frontend/Dockerfile` (builds from root context)
- **Backend Dockerfile**: Located at `/backend-node/Dockerfile` (builds from backend-node context)

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v8 or higher (comes with Node.js)
- **PostgreSQL**: v13 or higher (or Docker for containerized database)
- **Git**: For cloning the repository

### Backend Setup

1. **Navigate to backend directory**:
```bash
   cd backend-node
```

2. **Install dependencies**:
```bash
npm install
   ```

3. **Create `.env` file** in `backend-node/` directory:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/slotswapper?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=4000
   FRONTEND_URL="http://localhost:5173"
   NODE_ENV="development"
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate --schema=./src/prisma/schema.prisma
   ```

5. **Run database migrations**:
   ```bash
   npx prisma migrate dev --schema=./src/prisma/schema.prisma
   ```
   This creates the database schema and applies migrations.

6. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

7. **Start development server**:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:4000` with hot-reloading enabled.

8. **Build for production** (optional):
   ```bash
   npm run build
   npm start
   ```

### Frontend Setup

1. **Navigate to project root** (if not already there):
   ```bash
   cd ..
   ```

2. **Install dependencies**:
```bash
npm install
   ```

3. **Create `.env` file** in root directory (optional, defaults to `http://localhost:4000`):
   ```env
   VITE_API_BASE_URL=http://localhost:4000
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` with hot module replacement.

5. **Build for production** (optional):
   ```bash
   npm run build
   npm run preview
   ```

### Docker Setup (Alternative)

If you prefer containerized development, use Docker Compose:

1. **Create `.env` file** in project root:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

2. **Start all services**:
   ```bash
   docker-compose up --build
   ```

3. **Access services**:
   - Backend: `http://localhost:4000`
   - Frontend: `http://localhost:5173`
   - Database: `localhost:5432`

**Note**: The Docker setup includes hot-reloading for both frontend and backend, with persistent database storage via named volumes.

## ⚙️ Environment Variables

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT token signing |
| `PORT` | No | `4000` | Backend server port |
| `FRONTEND_URL` | No | `http://localhost:5173` | Frontend URL for CORS configuration |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`) |

### Backend `.env` Example

Create `backend-node/.env`:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:admin@localhost:5432/slotswapper?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"

# Server Configuration
PORT=4000
NODE_ENV="development"

# CORS Configuration
FRONTEND_URL="http://localhost:5173"
```

### Frontend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:4000` | Backend API base URL |

### Frontend `.env` Example

Create `.env` in project root:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### Endpoints Table

#### Authentication Endpoints

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/signup` | No | `{ name, email, password }` | Create new user account |
| `POST` | `/api/auth/login` | No | `{ email, password }` | User login |

#### Event Endpoints

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/events` | Yes | - | Get user's events |
| `POST` | `/api/events` | Yes | `{ title, startTime, endTime, status? }` | Create new event |
| `PUT` | `/api/events/:id` | Yes | `{ title?, startTime?, endTime?, status? }` | Update event |
| `DELETE` | `/api/events/:id` | Yes | - | Delete event |

#### Marketplace & Swap Endpoints

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/swappable-slots` | Yes | - | List available swappable slots |
| `POST` | `/api/swap-request` | Yes | `{ mySlotId, theirSlotId }` | Create swap request |
| `GET` | `/api/swap-requests` | Yes | - | List swap requests (incoming & outgoing) |
| `POST` | `/api/swap-response/:requestId` | Yes | `{ accept: boolean }` | Accept/reject swap request |



## 📱 Frontend Usage

### Pages Overview

1. **Login/Signup** (`/login`, `/signup`)
   - User authentication pages
   - JWT token stored in localStorage after successful login

2. **Dashboard** (`/dashboard`)
   - Displays user's calendar events
   - Create, update, and delete events
   - Toggle event status between `BUSY` and `SWAPPABLE`

3. **Marketplace** (`/marketplace`)
   - Browse available swappable slots from other users
   - Filter and search functionality
   - Initiate swap requests

4. **Requests** (`/requests`)
   - View incoming swap requests (pending responses)
   - View outgoing swap requests (awaiting responses)
   - Accept or reject incoming requests

### Frontend Configuration

**Set API Base URL**:

Create `.env` in project root:
```env
VITE_API_BASE_URL=http://localhost:4000
```

**Run Development Server**:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` with hot module replacement enabled.



## 🎁 Bonus Features & How to Run Them

### Docker Support

**How to run**:
```bash
docker-compose up --build
```

**Features**:
- Multi-container orchestration (backend, frontend, database)
- Hot-reloading for development
- Persistent database storage
- Isolated network for services


## ⚠️ Assumptions & Limitations

### Timezone Handling
- **Assumption**: All dates are stored and processed in UTC
- **Limitation**: Frontend displays dates in user's local timezone, but no automatic timezone conversion in backend
- **Recommendation**: Implement timezone-aware date handling for production

### Calendar Integration
- **Assumption**: Events are standalone (no external calendar sync)
- **Limitation**: No Google Calendar, Outlook, or iCal integration
- **Future Enhancement**: OAuth-based calendar synchronization

### Token Refresh
- **Assumption**: JWT tokens expire after 7 days
- **Limitation**: No automatic token refresh mechanism
- **Current Behavior**: Users must re-login after token expiration
- **Future Enhancement**: Implement refresh token strategy

### Event Overlap Detection
- **Assumption**: Users can create overlapping events
- **Limitation**: No automatic overlap detection or conflict resolution
- **Future Enhancement**: Validate event conflicts before creation

### Swap Request Expiry
- **Assumption**: Swap requests remain pending indefinitely
- **Limitation**: No automatic expiry for pending requests
- **Future Enhancement**: Implement request expiry (e.g., 7 days)

### Concurrent Swap Handling
- **Assumption**: Only one swap request per event pair at a time
- **Limitation**: If an event is in `SWAP_PENDING`, no new swap requests can be created
- **Behavior**: Concurrent requests are rejected with 409 Conflict

### Database Constraints
- **Assumption**: Email uniqueness is enforced at database level
- **Limitation**: No email verification required
- **Future Enhancement**: Add email verification flow

## 👨‍💻 Author & License

**Developed by Anvesh Srivastava**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for checking out SlotSwapper! If you have questions or feedback, please open an issue on GitHub.

[![GitHub stars](https://img.shields.io/github/stars/AnveshSrivastava/SlotSwapper?style=social)](https://github.com/AnveshSrivastava/SlotSwapper/stargazers)

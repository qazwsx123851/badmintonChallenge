# 🏸 Badminton Court Registration System

A comprehensive badminton court booking and tournament management system built with modern web technologies. This application enables users to register for badminton events (individually or as teams), manages court availability, and automatically allocates matches across available courts.

## ✨ Features

### User & Team Management
- **User Registration & Authentication**: Secure login system with session management
- **Team Creation**: Create teams with designated captains (max 2 members per team)
- **Team Management**: Invite and manage team members

### Event Management
- **Event Creation**: Administrators can create badminton events with customizable time slots
- **Real-time Registration Tracking**: Live capacity monitoring with progress indicators
- **Registration Types**: Support for both individual and team registrations
- **Capacity Control**: Automatic enforcement of participant limits with visual feedback

### Court Management
- **CRUD Operations**: Full create, read, update, and delete functionality for courts
- **Availability Tracking**: Real-time court status monitoring
- **Match Display**: Shows current and upcoming matches for each court
- **Business Rules Enforcement**:
  - Minimum 1 court required in system
  - Cannot delete courts with scheduled or in-progress matches
  - Court capacity limited to max 10 people

### Automatic Match Allocation
- **Smart Allocation Algorithm**: Automatically distributes participants across available courts
- **Singles vs Doubles Detection**: Intelligently identifies match types based on participant count
  - Singles: 2 participants (1v1)
  - Doubles: 4 participants (2v2)
- **Fair Distribution**: 30-minute time slots with court rotation for balanced play time
- **Capacity Respect**: Ensures court capacity limits (max 10 people per court) are maintained

### Match Schedule
- **Comprehensive View**: Display all matches with event names, times, and participants
- **Visual Indicators**: Automatic badges for singles/doubles matches
- **Real-time Updates**: Schedule refreshes to reflect latest allocations

## 🎨 Design

The application features a **Material Design 3**-inspired interface optimized for sports applications:

- **Color Palette**: 
  - Electric Blue (Primary)
  - Vibrant Orange (Secondary)
  - Active Green (Accents)
- **Typography**: Roboto font family for consistency
- **Responsive Layout**: Mobile-first design optimized for athletes on-the-go
- **Elevated UI**: Pronounced shadows and depth for modern aesthetics
- **Touch-Optimized**: Large interactive elements for mobile devices

## 🏗️ Architecture

### Frontend Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (with hot module replacement)
- **UI Components**: Radix UI primitives + shadcn/ui design system
- **Styling**: Tailwind CSS with custom theme
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side navigation
- **Form Handling**: React Hook Form with Zod validation
- **Date/Time Picker**: react-datepicker with custom Bootstrap-compatible styling

### Backend Stack

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon serverless connector)
- **ORM**: Drizzle ORM for type-safe queries
- **Session Store**: PostgreSQL-backed sessions (connect-pg-simple)
- **Validation**: Zod schemas shared between frontend and backend

### Database Schema

```
users
├── id (UUID, primary key)
├── username (unique)
└── password (hashed)

teams
├── id (UUID, primary key)
├── name
├── captainId (foreign key → users.id)
└── members (array of user IDs)

courts
├── id (UUID, primary key)
├── name
└── isAvailable (boolean)

events
├── id (UUID, primary key)
├── name
├── startTime
├── endTime
├── maxParticipants
└── status

registrations
├── id (UUID, primary key)
├── eventId (foreign key → events.id)
├── userId (foreign key → users.id, nullable)
├── teamId (foreign key → teams.id, nullable)
├── registrationType (individual | team)
└── registeredAt

matches
├── id (UUID, primary key)
├── eventId (foreign key → events.id)
├── courtId (foreign key → courts.id)
├── participantIds (array of user/team IDs)
├── startTime
├── endTime
└── status (scheduled | in_progress | completed)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
SESSION_SECRET=your-session-secret
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd badminton-court-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
.
├── client/
│   └── src/
│       ├── components/      # Reusable UI components
│       │   ├── ui/         # shadcn/ui components
│       │   ├── CourtCard.tsx
│       │   ├── EventCard.tsx
│       │   ├── TeamCard.tsx
│       │   ├── EditCourtDialog.tsx
│       │   ├── RegistrationDialog.tsx
│       │   └── MatchScheduleTable.tsx
│       ├── pages/          # Page components
│       │   ├── CourtsPage.tsx
│       │   ├── EventsPage.tsx
│       │   ├── MatchesPage.tsx
│       │   └── TeamsPage.tsx
│       ├── lib/            # Utilities and helpers
│       └── App.tsx         # Root component with routing
├── server/
│   ├── index.ts           # Express server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Storage abstraction layer
│   └── vite.ts            # Vite development server integration
├── shared/
│   └── schema.ts          # Shared Drizzle schemas and Zod validators
└── migrations/            # Database migration files
```

## 🔑 Key Business Rules

1. **Team Constraints**:
   - Maximum 2 members per team (captain + 1 member)
   - Captain must be set when creating a team

2. **Registration Rules**:
   - Individual registration counts as 1 person
   - Team registration counts as 2 people (captain + member)
   - Registration blocked when event reaches maxParticipants

3. **Court Constraints**:
   - System must have at least 1 court at all times
   - Maximum 10 people per court during matches
   - Cannot delete courts with scheduled or in-progress matches

4. **Match Allocation**:
   - Singles matches: 2 participants (1v1)
   - Doubles matches: 4 participants (2v2)
   - Matches allocated in 30-minute time slots
   - Fair court rotation for all participants

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:push --force` - Force push schema changes (use with caution)

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Tailwind CSS for styling (following Material Design 3 principles)
- Component-based architecture with clear separation of concerns

## 🧪 Testing

The application includes comprehensive end-to-end testing covering:
- Event creation and registration flows
- Mixed individual and team registrations
- Automatic match allocation
- Schedule viewing with participant names
- Court management operations

## 🔐 Security Features

- Password hashing for user accounts
- Session-based authentication
- CSRF protection via session management
- Input validation on both client and server
- SQL injection prevention via parameterized queries (Drizzle ORM)

## 📝 API Endpoints

### Courts
- `GET /api/courts` - List all courts
- `POST /api/courts` - Create a new court
- `PUT /api/courts/:id` - Update court details
- `DELETE /api/courts/:id` - Delete a court (with business rule validation)

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get event details

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id` - Get team details

### Registrations
- `GET /api/registrations` - List all registrations
- `POST /api/registrations` - Create a new registration
- `GET /api/registrations/event/:eventId` - Get registrations for an event

### Matches
- `GET /api/matches` - List all matches
- `POST /api/events/:eventId/allocate-matches` - Auto-allocate matches for an event

## 🌟 Recent Updates

### 2025-10-31: High-Priority Feature Enhancements
- **Registration Dialog Real-time Updates**: Automatically refreshes event capacity when opened
- **Match Schedule Improvements**: Added event name column and automatic singles/doubles badges
- **Court Management System**:
  - Edit court name and availability
  - Delete courts with business rule validation
  - Display current and upcoming matches for each court
  - Comprehensive participant name resolution

### 2025-10-31: Business Rules & Allocation Improvements
- Schema-level validation for team sizes and court capacity
- Enhanced allocation algorithm with singles/doubles distinction
- Real-time capacity checking during registration
- Improved error messages and user feedback

## 🤝 Contributing

This is a demonstration project built for learning and showcasing full-stack development skills.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Replit](https://replit.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Design inspired by Material Design 3

---

**Built with ❤️ for the badminton community**

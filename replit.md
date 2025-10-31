# Badminton Court Registration System

## Overview

A comprehensive badminton court booking and tournament management system built with React, Express, and PostgreSQL. The application enables users to register for badminton events (individually or as teams), manages court availability, and automatically allocates matches across available courts. The system features a Material Design-inspired interface with vibrant sports-themed colors and responsive layouts optimized for mobile athletes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: Radix UI primitives with shadcn/ui design system, styled using Tailwind CSS. The design follows Material Design 3 principles with a custom sports-focused color palette (Electric Blue primary, Vibrant Orange secondary, Active Green accents).

**State Management**: TanStack Query (React Query) for server state management, providing automatic caching, background refetching, and optimistic updates. No global client-side state management is used—component state is handled locally with React hooks.

**Routing**: Wouter for lightweight client-side routing.

**Form Management**: React Hook Form with Zod schema validation for type-safe form handling.

**Design System**: Custom implementation based on Material Design 3 with:
- Roboto font family for consistency
- Pronounced elevation and shadows for depth
- Bold, vibrant color palette optimized for sports applications
- Touch-optimized interactions for mobile users
- Rounded corners (lg: 16px, md: 12px) for modern aesthetics

**Key Architectural Decisions**:
- Component-based architecture with reusable UI components (EventCard, TeamCard, CourtCard, etc.)
- Custom theme system using CSS variables for easy color customization
- Responsive design with mobile-first approach
- Accessibility features through Radix UI primitives

### Backend Architecture

**Framework**: Express.js with TypeScript, running on Node.js.

**API Design**: RESTful API with resource-based endpoints organized by entity type (courts, events, teams, registrations, matches).

**Data Validation**: Zod schemas shared between frontend and backend for consistent validation.

**Session Management**: Express sessions with connect-pg-simple for PostgreSQL-backed session storage.

**Key Architectural Decisions**:
- Storage abstraction layer (IStorage interface) to decouple business logic from data access
- Centralized route registration in routes.ts
- Request/response logging middleware for debugging
- Error handling with structured JSON responses

### Database Architecture

**Database**: PostgreSQL (via Neon serverless connector for cloud deployment).

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Schema Design**:
- **users**: User accounts with username/password authentication
- **teams**: Team entities with captain and member relationships
- **courts**: Court availability and metadata
- **events**: Scheduled badminton events with time slots and participant limits
- **registrations**: Individual or team event registrations
- **matches**: Match allocations linking events, courts, and participants

**Key Architectural Decisions**:
- UUID primary keys for all entities
- Array columns for flexible member/participant relationships
- Timestamp tracking for registration ordering
- Status fields for workflow management (event status, match status)
- Drizzle migrations in `migrations/` directory

### Core Features

**User & Team Management**:
- User registration and authentication
- Team creation with captain designation
- Team member management

**Event Management**:
- Admin creation of badminton events with time slots
- Real-time registration count tracking
- Maximum participant limits
- Event status workflow (開放報名/Open Registration)

**Court Management**:
- CRUD operations for court entities
- Availability tracking
- Court assignment to matches

**Automatic Match Allocation**:
- Algorithm to distribute registered participants across available courts
- Time slot generation based on event duration
- Fair distribution of playing time

**Real-time Updates**:
- React Query automatic refetching ensures UI reflects latest server state
- Optimistic updates for better UX

## External Dependencies

### Third-Party Services

**Database**: Neon PostgreSQL serverless database (configured via DATABASE_URL environment variable).

**Deployment**: Designed for Replit deployment with:
- Replit-specific Vite plugins for development (cartographer, dev-banner, runtime error overlay)
- Environment-specific configuration handling

### Key NPM Packages

**Frontend**:
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: Unstyled, accessible UI primitives
- `tailwindcss`: Utility-first CSS framework
- `react-hook-form` + `@hookform/resolvers`: Form handling
- `zod`: Schema validation
- `date-fns`: Date manipulation
- `wouter`: Lightweight routing
- `lucide-react`: Icon library

**Backend**:
- `express`: Web framework
- `drizzle-orm`: TypeScript ORM
- `@neondatabase/serverless`: Neon PostgreSQL driver
- `connect-pg-simple`: PostgreSQL session store
- `drizzle-zod`: Zod schema generation from Drizzle schemas

**Build Tools**:
- `vite`: Frontend build tool and dev server
- `tsx`: TypeScript execution for development
- `esbuild`: Backend bundling for production

### Environment Configuration

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string (required for Drizzle)
- `NODE_ENV`: Development/production mode toggle

### Development Tools

- TypeScript for type safety across the full stack
- Path aliases for clean imports (`@/`, `@shared/`, `@assets/`)
- Hot module replacement in development
- Source maps for debugging
# Hednor Fashion E-commerce Platform

## Overview

Hednor is a modern fashion e-commerce platform built with a full-stack TypeScript architecture. The application provides a comprehensive online shopping experience with features including product browsing, cart management, user profiles, and wishlist functionality. The platform focuses on fashion items across multiple categories including men's, women's, kids' clothing, accessories, and beauty products.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: Zustand with persistence for cart and wishlist state
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and bundling
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Centralized schema definitions in shared directory

## Key Components

### Data Models
The application defines several core entities:
- **Users**: Authentication and profile management
- **Categories**: Hierarchical product categorization
- **Products**: Complete product information with variants, pricing, and inventory
- **Cart Items**: Shopping cart functionality with user sessions
- **Wishlist Items**: Save-for-later functionality
- **Orders**: Order processing and history

### UI System
- Custom design system with Hednor branding (gold accent color)
- Responsive design optimized for mobile and desktop
- Component library based on Radix UI primitives
- Toast notifications and loading states
- Modal dialogs and slide-out panels

### State Management
- **Client State**: Zustand store for cart, wishlist, and UI state
- **Server State**: TanStack Query for API data caching and synchronization
- **Persistence**: Local storage for cart and wishlist data
- **Session Management**: Planned for user authentication (not yet implemented)

## Data Flow

### Product Browsing
1. Categories and products are fetched from API endpoints
2. Data is cached using React Query for optimal performance
3. Filtering and search parameters are managed via URL query strings
4. Product cards display essential information with wishlist toggle

### Shopping Experience
1. Add to cart actions update Zustand store and persist to local storage
2. Cart slideout provides real-time quantity management
3. Wishlist functionality allows saving products for later
4. Price calculations include sale pricing and formatting for Indian currency

### Search and Filtering
1. Search queries are processed server-side
2. Category-based filtering via URL parameters
3. Advanced filtering by price range, brand, and size
4. Grid and list view modes for product display

## External Dependencies

### UI Libraries
- Radix UI components for accessible primitives
- Lucide React for consistent iconography
- Embla Carousel for image galleries
- date-fns for date formatting utilities

### Development Tools
- Vite with React plugin and runtime error overlay
- Replit integration for development environment
- PostCSS with Tailwind CSS processing
- TypeScript for type safety across the stack

### Database & ORM
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL for cloud database
- Drizzle Kit for migration management
- Zod for runtime schema validation

## Deployment Strategy

### Development Environment
- Replit-optimized configuration with modules for Node.js, web, and PostgreSQL
- Hot module replacement via Vite dev server
- Automatic port detection and forwarding
- Development-specific error overlays and debugging tools

### Production Build
- Client: Vite builds React app to static assets
- Server: esbuild bundles Express server for production
- Environment variables for database connection
- Autoscale deployment target configuration

### Database Management
- Schema-first approach with Drizzle ORM
- Migration-based database versioning
- Environment-specific database URLs
- Connection pooling via Neon serverless

## Changelog
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
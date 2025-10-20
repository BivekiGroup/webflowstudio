# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WebFlow Studio is a visual website builder platform combining a Tilda-like visual editor with n8n-style workflow automation. Users create interfaces visually, export clean code, and deploy themselves (no built-in hosting). The platform is built with Next.js 15 App Router, Prisma/PostgreSQL, and shadcn/ui components.

**Key Product Concept**: Visual development tool with code export capability - NOT a hosting platform. Users connect to cloud databases (no built-in DB) and export code for self-deployment.

## Development Commands

```bash
# Install dependencies
npm install

# Database setup (first time)
npx prisma migrate dev --name init-auth
# OR if migrations can't be applied:
npx prisma db push
npx prisma generate

# Development server (uses Turbopack)
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint

# Database operations
npx prisma studio              # Open Prisma Studio GUI
npx prisma generate            # Regenerate Prisma Client
npx prisma db push             # Push schema changes without migration
npx prisma migrate dev         # Create and apply migration
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Custom shadcn/ui components, Tailwind CSS 4, Lucide icons
- **Auth**: Custom bcrypt-based session system (no external auth library)
- **Drag & Drop**: @dnd-kit for canvas block ordering

### Directory Structure

```
src/
├── app/
│   ├── (auth)/              # Auth route group: /login, /register
│   │   ├── login/
│   │   ├── register/
│   │   └── actions.ts       # Server actions for auth
│   ├── dashboard/           # Protected dashboard
│   │   ├── page.tsx         # Dashboard home (project list)
│   │   ├── projects/
│   │   │   ├── [slug]/      # Studio workspace for project
│   │   │   ├── studio-workspace.tsx  # Main canvas component
│   │   │   ├── block-config.tsx      # Block definitions
│   │   │   └── actions.ts            # Canvas/data source actions
│   │   └── create-project-form.tsx
│   ├── embed/               # Embed routes for projects
│   ├── share/               # Public sharing routes
│   ├── page.tsx             # Landing page
│   └── layout.tsx
├── lib/
│   ├── auth.ts              # Session management, getCurrentUser()
│   ├── prisma.ts            # Prisma client singleton
│   ├── projects.ts          # Project CRUD operations
│   ├── data-sources.ts      # Data source management
│   ├── project-status.ts    # Status badge configs
│   └── utils.ts             # cn() helper
└── components/ui/           # shadcn/ui components
```

### Key Architecture Patterns

**1. Server Components by Default**
- Most pages are Server Components for data fetching
- Client Components marked with `"use client"` only when needed for interactivity
- Auth checks happen in Server Components via `getCurrentUser()`

**2. Server Actions for Mutations**
- All form submissions use Server Actions (not API routes)
- Actions defined in `actions.ts` files, bound to specific resources
- Example: `saveCanvasAction.bind(null, projectId, projectSlug)`

**3. Session-Based Auth**
- Custom implementation using Prisma models: `User` ↔ `Session`
- Sessions stored in http-only cookies (30-day expiry)
- `getCurrentUser()` in `lib/auth.ts` reads session from cookies
- No JWT, no external auth library

**4. Studio Workspace Architecture**
- **Canvas**: JSON-serialized state stored in `Project.canvasState`
- **Blocks**: Reusable UI components (Hero, Stats, Workflow, CTA, Form)
- **Data Sources**: REST/GraphQL/Mock connections with sample data
- **Bindings**: Connect blocks to data sources via `CanvasDataBinding`
- Uses drag-and-drop for block ordering
- Auto-save with debouncing

## Studio Workspace Details

The Studio (`/dashboard/projects/[slug]`) is the core feature - a visual canvas for building interfaces.

### Canvas State Structure
```typescript
type CanvasState = {
  blocks: Array<{
    instanceId: string;
    blockId: BlockId;  // "hero" | "stats" | "workflow" | "cta" | "form"
    props: BlockPropsMap[BlockId];
    notes?: string;
  }>;
  selectedInstanceId: string | null;
  bindings: CanvasDataBinding[];
}
```

### Key Components
- **StudioWorkspace** (`studio-workspace.tsx`): Main canvas component with:
  - Sheet-based UI for blocks library (left), data sources (left), inspector (right)
  - Drag-and-drop block ordering
  - Auto-save functionality
  - Block inspector opens on block click

- **Block System** (`block-config.tsx`):
  - Each block has: id, title, description, tags, render(), createDefaultProps()
  - Props editors for customization
  - Preview components for library

- **Data Sources**:
  - Types: REST, GraphQL, MOCK
  - Each source has multiple samples (example responses)
  - Blocks can bind to source + sample via inspector

### UI Patterns

**Design System**:
- Background: `bg-slate-900` with subtle radial gradients
- Cards: `bg-slate-800/40` to `bg-slate-800/80` variants
- Borders: `border-slate-700/60` or `border-slate-800/60`
- Primary color: Emerald (`emerald-500`, `emerald-400`)
- All fonts are slate variants for consistency

**Sheet Usage**:
- Blocks library opens from "Блоки" button (left sheet)
- Data sources opens from "Данные" button (left sheet)
- Inspector opens automatically on block selection (right sheet)

**Form Patterns**:
- All forms use Server Actions with `useActionState()`
- Loading states during submission
- Auto-close modals on success

## Database Schema Notes

- **User**: Auth + profile data
- **Session**: 30-day sessions, cascade delete with user
- **Project**: Has `canvasState` (JSON), `status` (enum), `slug` (unique)
- **DataSource**: Belongs to project, has multiple samples
- **DataSample**: Example API responses for testing bindings

All IDs are UUIDs. Cascading deletes are configured for sessions, projects, data sources.

## Branding & Content

- Product name: **WebFlow Studio**
- Company: **Biveki** (always link to biveki.ru)
- Domain: webflowstudio.ru
- Tariffs: Starter (free), Pro (1,990₽), Team (4,990₽)

**Key Features to Mention**:
- Visual editor (like Tilda) + workflow automation (like n8n)
- Code export (users deploy themselves)
- Cloud database connections (no built-in DB)
- No automatic deployment/hosting

## Important Files

- `src/app/dashboard/projects/studio-workspace.tsx`: Core visual editor (2200+ lines)
- `src/lib/auth.ts`: Session management logic
- `src/lib/projects.ts`: Project CRUD with CanvasState typing
- `prisma/schema.prisma`: Database models
- `src/components/ui/sheet.tsx`: Modal panels for studio UI

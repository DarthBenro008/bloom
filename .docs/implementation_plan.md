# 🌸 Bloom Implementation Plan

## Overview

This plan implements the Bloom accountability app as described in the PRD, using the specified tech stack:
- **Next.js App Router** with **Tailwind CSS v4** and **shadcn** components
- **NeonAuth** (with Better Auth) for Google authentication  
- **Drizzle ORM** + **NeonDB** for database
- **AI SDK** (`@ai-sdk/anthropic` + `ai`) for AI features
- **Canvas-based garden visualization**
- **Server Actions** for AI interactions

---

## 1. Project Structure (Implemented)

```
bloom/
├── app/
│   ├── (auth)/                      # Auth-related routes
│   │   ├── auth/[path]/page.tsx     # Sign-in/sign-up views
│   │   └── layout.tsx
│   ├── (app)/                       # Protected app routes
│   │   ├── layout.tsx               # App shell with header
│   │   ├── page.tsx                 # Redirect to tasks/onboarding
│   │   ├── onboarding/page.tsx      # New user onboarding
│   │   ├── tasks/
│   │   │   ├── page.tsx             # Task list with garden sidebar
│   │   │   ├── new/page.tsx         # Create new task wizard
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Task detail with subtasks
│   │   │       └── complete/page.tsx # Completion reflection flow
│   │   └── account/[path]/page.tsx  # Account settings (NeonAuth)
│   ├── api/
│   │   └── auth/[...path]/route.ts  # NeonAuth handler
│   ├── layout.tsx                   # Root layout with NeonAuth provider
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Tailwind + NeonAuth styles
├── components/
│   ├── ui/                          # Existing shadcn components
│   ├── garden/                      # Garden visualization
│   │   ├── garden-canvas.tsx        # Canvas-based garden renderer
│   │   ├── plants.ts                # Plant types, colors, configs
│   │   └── garden-preview.tsx       # Task preview showing potential plants
│   ├── tasks/                       # Task-related components
│   │   ├── task-input.tsx           # Vague task input form
│   │   ├── subtask-list.tsx         # Editable AI breakdown
│   │   ├── commitment-form.tsx      # "What will exist?" form
│   │   ├── reflection-form.tsx      # Completion reflection
│   │   └── task-card.tsx            # Task display card
│   └── onboarding/
│       └── onboarding-flow.tsx      # Multi-step onboarding wizard
├── lib/
│   ├── auth/
│   │   ├── server.ts                # NeonAuth server instance (lazy)
│   │   └── client.ts                # NeonAuth client
│   ├── db/
│   │   ├── index.ts                 # Drizzle client (lazy)
│   │   └── schema.ts                # Database schema with relations
│   ├── ai/
│   │   ├── prompts.ts               # ALL AI system prompts (centralized)
│   │   └── index.ts                 # Anthropic client (OpenCode proxy)
│   ├── actions/
│   │   ├── tasks.ts                 # Task CRUD + garden updates
│   │   └── ai.ts                    # AI-powered server actions
│   └── utils.ts                     # Utility functions
├── drizzle.config.ts                # Drizzle Kit config
├── proxy.ts                         # Auth proxy (replaces middleware)
├── .env.example                     # Environment template
└── .env.local                       # Your actual secrets
```

---

## 2. Database Schema

```typescript
// lib/db/schema.ts
import { pgTable, text, timestamp, integer, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const effortWeightEnum = pgEnum('effort_weight', ['light', 'medium', 'heavy']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed', 'abandoned']);
export const plausibilityLevelEnum = pgEnum('plausibility_level', ['high', 'medium', 'low']);

// Users table (synced with NeonAuth's neon_auth.users)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Matches NeonAuth user ID
  gardenHealth: integer('garden_health').default(100).notNull(), // 0-100
  totalTasksCompleted: integer('total_tasks_completed').default(0).notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),                    // Original vague input
  completionContract: text('completion_contract'),   // "What will exist?"
  status: taskStatusEnum('status').default('pending').notNull(),
  effortWeight: effortWeightEnum('effort_weight').default('medium').notNull(),
  plausibilityScore: integer('plausibility_score'), // 0-100, null until completed
  plausibilityLevel: plausibilityLevelEnum('plausibility_level'),
  reflectionResponse: text('reflection_response'),   // User's reflection
  reflectionQuestion: text('reflection_question'),   // AI-generated question
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// Subtasks table
export const subtasks = pgTable('subtasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  effortWeight: effortWeightEnum('effort_weight').default('light').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Plants table (garden state)
export const plants = pgTable('plants', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  taskId: uuid('task_id').references(() => tasks.id),
  plantType: text('plant_type').notNull(),           // 'flower', 'tree', 'shrub', etc.
  growthStage: integer('growth_stage').default(0).notNull(), // 0-5
  health: integer('health').default(100).notNull(),  // 0-100
  positionX: integer('position_x').notNull(),        // Grid position
  positionY: integer('position_y').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 3. AI System Prompts (Centralized)

All AI prompts are stored in `lib/ai/prompts.ts`:

- **TASK_BREAKDOWN**: Converts vague tasks into 2-6 concrete subtasks with effort weights
- **REFLECTION_QUESTION**: Generates grounding questions when marking tasks complete
- **PLAUSIBILITY_EVALUATION**: Assesses whether completion is believable (hidden from user)
- **ONBOARDING_WELCOME**: First-time user greeting

---

## 4. Plant Types (Mapped to Effort Levels)

| Effort Level | Plant Types | Growth Stages | Description |
|--------------|-------------|---------------|-------------|
| **Light** | Daisy, Tulip, Poppy | 5 stages | Quick blooming flowers |
| **Medium** | Rose, Sunflower, Lavender | 5 stages | Requires more care |
| **Heavy** | Oak Tree, Cherry Blossom, Maple | 5 stages | Majestic, slow-growing |

Each plant has:
- **Growth stages 0-5**: Seed → Sprout → Young → Growing → Mature → Flourishing
- **Health 0-100**: Affects color vibrancy and visual state
- **Decay mechanics**: Low plausibility causes health drop, visible wilting

---

## 5. Authentication (NeonAuth with Google)

Using Neon's shared OAuth credentials for Google authentication:
- Server instance in `lib/auth/server.ts`
- Client instance in `lib/auth/client.ts`
- API route handler in `app/api/auth/[...path]/route.ts`
- Middleware for protected routes

---

## 6. AI Configuration

Custom Anthropic client with OpenCode proxy:
```typescript
import { createAnthropic } from "@ai-sdk/anthropic";

const anthropic = createAnthropic({
  baseURL: "https://opencode.ai/zen/v1",
  apiKey: process.env.ANTHROPIC_API_KEY
});
```

---

## 7. Core User Flows

### 7.1 Task Creation Flow
1. User enters vague task (e.g., "Work on my startup")
2. AI breaks it into 2-6 actionable subtasks
3. User can edit/add/remove subtasks
4. User answers: "What will exist after this is done?"
5. Preview shows potential plant growth
6. Task is created

### 7.2 Task Completion Flow
1. User marks task complete
2. AI asks personalized reflection question
3. User provides free-text response
4. System evaluates plausibility (hidden)
5. Garden updates based on plausibility:
   - **High**: Full growth, vibrant plant
   - **Medium**: Partial growth, slightly muted
   - **Low**: No growth, existing plants may wilt

### 7.3 Garden Mechanics
- Canvas-based visualization
- Plants positioned on grid
- Real-time health/growth animations
- Visual decay for neglected tasks/dishonest completions

---

## 8. Implementation Phases

### Phase 1: Foundation
- Install dependencies
- Database schema + migrations
- NeonAuth setup
- Auth pages and middleware

### Phase 2: Core Task Loop
- AI prompts file
- Task creation flow
- Task list and detail pages

### Phase 3: Completion Flow
- Reflection form with AI question
- Plausibility evaluation
- Garden update logic

### Phase 4: Garden Visualization
- Canvas component
- Plant rendering with stages
- Health/decay visuals
- Animations

### Phase 5: Polish
- Onboarding flow
- Garden preview
- Dashboard layout
- Error handling

---

## 9. Environment Variables

```env
DATABASE_URL=postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 10. Dependencies

```json
{
  "dependencies": {
    "@ai-sdk/anthropic": "^3.0.38",
    "ai": "^6.0.75",
    "drizzle-orm": "^0.45.1",
    "@neondatabase/auth": "latest",
    "@neondatabase/serverless": "latest",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30.0"
  }
}
```

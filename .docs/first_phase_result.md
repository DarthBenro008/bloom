🌸 Bloom Implementation Complete
Summary
I've implemented the full Bloom MVP as specified in the PRD. Here's what's been built:
Core Features

1. Authentication (NeonAuth)
   - Google OAuth via Neon's shared credentials
   - Sign-in, sign-up, and account pages
   - Protected routes via proxy.ts
2. Task Creation Flow
   - Vague task input → AI breakdown → Commitment → Create
   - AI generates 2-6 actionable subtasks with effort weights
   - User commits to what will exist after completion
3. Task Completion Flow
   - Mark subtasks complete
   - AI-generated reflection question
   - Plausibility evaluation (hidden from user)
   - Garden updates based on plausibility
4. Garden Visualization
   - Canvas-based rendering
   - 9 plant types mapped to effort levels:
     - Light: Daisy, Tulip, Poppy
     - Medium: Rose, Sunflower, Lavender
     - Heavy: Oak, Cherry Blossom, Maple
   - Growth stages (0-5) and health (0-100)
   - Visible decay for low plausibility
5. Onboarding
   - Multi-step intro for new users
   - AI-generated welcome message
   - Explains the garden concept
     AI Integration
     All prompts are centralized in lib/ai/prompts.ts:

- TASK_BREAKDOWN - Converts vague tasks to actionable steps
- REFLECTION_QUESTION - Generates grounding questions
- PLAUSIBILITY_EVALUATION - Assesses completion honesty
- ONBOARDING_WELCOME - Welcomes new users
  Database Schema
- users - Garden health, task count, onboarding status
- tasks - Title, contract, status, plausibility
- subtasks - Individual steps with effort weights
- plants - Type, growth stage, health, position
  Getting Started

1. Set up environment variables in .env.local:
   DATABASE_URL=postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require
   NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
   NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
   ANTHROPIC_API_KEY=your-api-key
2. Push database schema:
   bun run db:push
3. Start development server:
   bun run dev
4. Access the app at http://localhost:3000
   File Structure Highlights
   | File | Purpose |
   |------|---------|
   | lib/ai/prompts.ts | All AI system prompts (centralized) |
   | lib/db/schema.ts | Database schema with plant types |
   | lib/actions/ai.ts | AI-powered server actions |
   | lib/actions/tasks.ts | Task CRUD + garden mechanics |
   | components/garden/garden-canvas.tsx | Canvas garden visualization |
   | app/(app)/tasks/new/page.tsx | Task creation wizard |
   | app/(app)/tasks/[id]/complete/page.tsx | Completion reflection |

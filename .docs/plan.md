# 🌸 Bloom — Product Requirements Document (PRD)

## 1. Product Overview

**Bloom** is a gamified accountability web application that helps users get real work done by turning productivity into a living, evolving garden. Instead of relying on checklists, streaks, or reminders, Bloom creates emotional stakes: when users complete meaningful work, their garden grows and thrives; when they procrastinate or falsely claim completion, their garden visibly withers.

Bloom is designed around a simple belief:  
**people don’t need more motivation, they need clearer action and visible consequences.**

The product uses AI to:

- Convert vague, overwhelming tasks into concrete, actionable steps
- Guide users through commitment and reflection
- Evaluate whether task completion is _plausible_, not just claimed

The garden is the core feedback mechanism — a visual representation of discipline over time.

---

## 2. Main Goal of the Project

The primary goal of Bloom is to **increase task follow-through for large or ambiguous work** by:

1. Removing ambiguity around what “done” actually means
2. Making progress emotionally visible instead of abstract
3. Encouraging honesty without intrusive verification
4. Creating a loop where doing the work feels easier than faking it

Bloom does not aim to maximize task count or streaks.  
It aims to maximize **believable progress**.

---

## 3. Target Users

### Primary Users

- Builders, founders, students, and makers
- Individuals working on self-directed, cognitively heavy tasks
- Users who struggle with procrastination on vague goals
- People who enjoy light gamification but dislike rigid productivity tools

### Out of Scope

- Team or collaborative task management
- Enterprise productivity workflows
- Highly structured or compliance-driven task tracking

---

## 4. Core Product Philosophy

Bloom follows four core principles:

1. **Clarity before motivation**  
   Motivation fails when tasks are vague. Bloom prioritizes clarity first.

2. **Plausibility over proof**  
   The system does not try to verify work. It evaluates whether progress makes sense.

3. **Visual consequence over guilt**  
   No streaks, no nagging reminders. The garden reflects behavior naturally.

4. **The system never shames the user**  
   Consequences exist, but language and tone remain supportive.

---

## 5. Detailed User Flow

### 5.1 Onboarding & First Experience

- User signs up or logs in
- User is introduced to the concept:
  - “Your work grows a garden.”
  - “Skipping work makes it wither.”
- User starts with an empty garden (bare soil)
- The app prompts the user to create their first task

The goal of onboarding is **immediate understanding**, not feature education.

---

### 5.2 Task Creation (Vague Input)

- User enters a task in natural language  
  Examples:
  - “Work on my startup”
  - “Prepare for hackathon demo”
  - “Study system design”

- The system intentionally allows vague input
- No forced structure is imposed on the user

---

### 5.3 AI Task Breakdown

- AI analyzes the vague task and:
  - Breaks it into 2–6 concrete, actionable subtasks
  - Assigns an effort weight to each task:
    - Light (quick, low effort)
    - Medium (focused effort)
    - Heavy (deep work)

- The breakdown is shown to the user for review
- User can:
  - Accept the breakdown
  - Edit task wording
  - Remove or add steps

This step ensures the user knows _exactly_ what they are committing to.

---

### 5.4 Commitment & Completion Contract

Before starting the task, Bloom asks a single grounding question:

> “What will exist after this task is done?”

Examples of answers:

- “A deployed landing page”
- “Three written bullet points”
- “A decision document”
- “A working prototype”

This answer becomes the **completion contract**.

Purpose:

- Anchors the task in reality
- Sets a mental checkpoint for honesty later

---

### 5.5 Garden Preview & Stakes

- Bloom shows a preview of what completing this task will grow:
  - Plant type based on task weight
  - Growth stage that can be reached
- The user sees what is at stake _before_ starting

This creates intentional commitment.

---

### 5.6 Task Execution (User Works Outside Bloom)

- Bloom does not track time
- Bloom does not interrupt focus
- The user works independently

Bloom is intentionally passive during execution.

---

### 5.7 Task Completion & Reflection

When the user marks a task as completed:

- The system does **not** immediately reward the user
- AI asks one short reflection question such as:
  - “What exists now that didn’t before?”
  - “What’s the most concrete thing you finished?”
  - “What changed as a result of this?”

The user responds in free text.

This step is designed to make the user briefly _account_ for their work.

---

### 5.8 Plausibility Evaluation (System-Level)

- AI evaluates the user’s response based on:
  - Specificity
  - Alignment with task difficulty
  - Internal consistency

- A plausibility score is generated (hidden from the user)

The system does **not** judge quality — only whether real work likely happened.

---

### 5.9 Garden Update (Reward or Consequence)

Based on plausibility:

- **High plausibility**
  - Plant grows fully
  - Garden becomes more vibrant

- **Medium plausibility**
  - Partial growth
  - Plant looks weaker or slower

- **Low plausibility**
  - No growth
  - Existing plant health may decay

Plants never disappear silently.  
Consequences are visible but non-punitive.

---

### 5.10 Long-Term Feedback Loop

Over time:

- Honest users unlock healthier gardens and rarer plants
- Dishonest patterns naturally stall progression
- The garden becomes a narrative of real discipline

Users learn that:

> “If I want my garden to feel good, I need to actually do the work.”

---

## 6. Gamification & Motivation System

- Plants represent effort, not time
- Growth stages represent consistency
- Withering represents avoidance
- There are no streaks or timers

The garden is the single source of truth.

---

## 7. Technical Requirements

### Frontend

- **NextJS** (App Router)
- **Tailwind CSS v4**
- **ShadCN UI components**

### Backend & Infrastructure

- **Drizzle ORM**
- **NeonDB (Postgres)**
- **NeonAuth** for authentication

### AI Integration

- AI is used for:
  - Task decomposition
  - Reflection question generation
  - Plausibility evaluation

The system must support low-latency AI calls suitable for interactive UX.

---

## 8. Non-Goals

- Team collaboration
- Calendar or task-manager integrations
- Hardcore verification (screenshots, commits, etc.)
- Productivity analytics dashboards
- Mobile-native applications (web-first)

---

## 9. Risks & Design Mitigations

### Risk: Users lie about task completion

**Mitigation:**  
Plausibility checks, narrative consistency over time, and emotional cost through garden decay.

### Risk: Over-gamification reduces seriousness

**Mitigation:**  
Minimal mechanics, grounded language, and real-world task anchoring.

### Risk: Feature creep during hackathon

**Mitigation:**  
Strict focus on one loop: task → reflection → garden update.

---

## 10. MVP Scope (Hackathon Build)

Bloom MVP includes:

- User authentication
- Vague task input
- AI task breakdown
- Completion contract
- Reflection-based plausibility check
- Visual garden with growth and decay

Anything beyond this is considered future work.

---

## 11. Product Summary

**Bloom** helps users do real work by making progress visible, believable, and emotionally meaningful — turning discipline into something that can grow, and neglect into something that fades.

> _Do the work. Watch it bloom._

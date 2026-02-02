# Task Creation Flow - Redesign Summary

## Changes Made

### Overview
The task creation flow has been completely redesigned based on user feedback to provide a more intuitive, AI-assisted experience with chat-based modifications.

---

## New Flow

### Before (3 steps)
```
Step 1: Input vague task
Step 2: Review AI-generated subtasks (edit manually)
Step 3: Manually write expected output
```

### After (2 steps)
```
Step 1: Input vague task
Step 2: Review & Refine (all-in-one)
  - AI-suggested subtasks (editable)
  - AI-suggested expected output (editable)
  - AI-suggested effort level (overridable)
  - Chat interface to modify with AI
  - Garden preview
```

---

## Key Improvements

### 1. **AI Suggests Everything**
- **Subtasks**: 2-6 actionable steps with effort weights
- **Expected Output**: What will concretely exist after completion
- **Overall Effort**: Light/Medium/Heavy based on total cognitive load

### 2. **Chat-Based Modifications**
Users can now chat with AI to refine the breakdown:
- "Make this simpler"
- "Add a testing step"
- "This is too complex, give me fewer steps"
- "Change the expected output to focus on documentation"

### 3. **Visual AI Indicators**
Components show "✨ AI suggested" badges on AI-generated content, removed when user manually edits.

### 4. **Quick Actions**
- **Regenerate button**: Get a completely fresh breakdown
- **Quick suggestion chips**: Common modifications with one click

---

## Files Changed

### New Files
| File | Purpose |
|------|---------|
| `components/tasks/breakdown-chat.tsx` | Chat interface for AI modifications |
| `components/tasks/task-review.tsx` | Combined review screen |

### Updated Files
| File | Changes |
|------|---------|
| `lib/ai/prompts.ts` | Added expected output generation, added MODIFY_BREAKDOWN prompt |
| `lib/actions/ai.ts` | Updated schema with `suggestedExpectedOutput`, added `modifyBreakdown()` |
| `app/(app)/tasks/new/page.tsx` | Simplified to 2-step flow with chat support |

### Deleted Files
| File | Reason |
|------|--------|
| `components/tasks/subtask-list.tsx` | Replaced by task-review.tsx |
| `components/tasks/commitment-form.tsx` | Merged into task-review.tsx |

---

## Updated AI Schema

```typescript
const BreakdownSchema = z.object({
  subtasks: z.array(SubtaskSchema).min(2).max(6),
  suggestedOverallWeight: z.enum(['light', 'medium', 'heavy']),
  suggestedExpectedOutput: z.string(), // ✨ NEW
});
```

---

## New AI Actions

### `breakdownTask(vagueTask: string)`
Returns complete breakdown with:
- Subtasks with effort weights
- Suggested overall effort level
- Suggested expected output ✨ NEW

### `modifyBreakdown(task, currentBreakdown, userMessage)` ✨ NEW
Takes user's modification request and returns updated breakdown.

---

## User Experience

### Step 1: Input
User enters vague task like "Work on my startup pitch deck"

### Step 2: Review & Refine
AI generates:
```
STEPS (AI suggested ✨)
1. Research competitor decks [Medium]
2. Draft slide outline [Light]
3. Design key visuals [Heavy]
4. Write speaker notes [Light]

EXPECTED OUTPUT (AI suggested ✨)
A complete 10-slide pitch deck with visuals and 
speaker notes, ready to present to investors

OVERALL EFFORT: Heavy (AI suggested ✨)
```

User can:
- Edit any step inline
- Add/remove steps
- Edit expected output
- Change effort level
- Chat: "Make this simpler, I only have 2 hours"
- Click "🔄 Regenerate" for fresh breakdown

AI updates the breakdown based on chat:
```
STEPS (AI suggested ✨)
1. Create basic 5-slide outline [Light]
2. Add key talking points [Light]

EXPECTED OUTPUT (AI suggested ✨)
A simple 5-slide outline with talking points, 
ready to practice

OVERALL EFFORT: Light (AI suggested ✨)
```

---

## Technical Details

### Chat State Management
- Chat messages are ephemeral (session-only)
- Stored in component state: `ChatMessage[]`
- Each message has `role: 'user' | 'ai'` and `content: string`

### AI Modification Flow
1. User sends message in chat
2. Add user message to chat history
3. Call `modifyBreakdown()` with current state + message
4. Update breakdown with AI response
5. Add AI confirmation to chat history

### State Tracking
The component tracks which fields have been modified by user vs AI:
```typescript
isAiSuggested: {
  subtasks: boolean,
  weight: boolean,
  output: boolean,
}
```

This allows showing/hiding the "AI suggested" badges appropriately.

---

## Benefits

1. **Faster**: 2 steps instead of 3
2. **More helpful**: AI suggests everything, not just subtasks
3. **More flexible**: Chat-based modifications feel natural
4. **More transparent**: Clear visual indicators of AI suggestions
5. **User control**: Can override any suggestion or regenerate entirely

---

## Next Steps

To test the new flow:
1. Set up your `.env.local` with required credentials
2. Run `bun run dev`
3. Navigate to `/tasks/new`
4. Try creating a task with various modifications

Example test scenarios:
- Create a simple task, accept AI suggestions
- Create a complex task, ask AI to simplify
- Ask AI to add specific steps
- Regenerate to see alternative breakdowns
- Manually edit everything to override AI

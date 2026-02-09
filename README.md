# 🌸 Bloom

## What is Bloom?

**Bloom** is a gamified accountability web application that transforms productivity into a living, evolving garden. Instead of relying on traditional checklists, streaks, or reminders, Bloom creates emotional stakes: when you complete meaningful work honestly, your garden grows and thrives; when you procrastinate or falsely claim completion, your garden visibly withers.

Built on a simple belief: **people don't need more motivation—they need clearer action and visible consequences.**

Bloom uses AI to:
- Convert vague, overwhelming tasks into concrete, actionable steps
- Guide users through commitment and honest reflection
- Evaluate whether task completion is _plausible_, not just claimed
- Generate personalized questions that encourage accountability without shame

The garden serves as the core feedback mechanism—a visual representation of your discipline over time.

---

## How does Bloom work?

### 1️⃣ **Enter Your Task (Even If It's Vague)**
Tell Bloom what you want to work on in natural language:
- "Work on my startup"
- "Prepare for hackathon demo"
- "Study system design"

No forced structure required—Bloom accepts tasks exactly as they come to mind.

### 2️⃣ **AI Breaks It Down Into Actionable Steps**
Bloom's AI analyzes your vague input and:
- Creates 2-6 concrete, actionable subtasks
- Assigns effort weights (light, medium, heavy) based on cognitive load
- Orders tasks logically by dependency and workflow
- Provides a clear expected output: "What will exist after this is done?"

You can review, edit, add, or remove steps to make the breakdown truly yours.

### 3️⃣ **Commit to Your Work**
Before starting, Bloom asks one grounding question:
> _"What will exist after this task is done?"_

Your answer becomes your **completion contract**—anchoring the task in reality and setting a mental checkpoint for honesty later.

### 4️⃣ **Do the Work (Outside of Bloom)**
Bloom doesn't track time or interrupt your focus. It stays intentionally passive during execution—your job is simply to do the work.

### 5️⃣ **Reflect on Your Completion**
When you mark a task complete, Bloom doesn't immediately reward you. Instead, it asks a personalized reflection question:
- "What exists now that didn't before?"
- "What's the most concrete thing you finished?"
- "If you showed someone your progress, what would they see?"

This brief reflection makes you account for your work without shame or judgment.

### 6️⃣ **Watch Your Garden Respond**
Based on the plausibility of your reflection (evaluated by AI behind the scenes), your garden updates:

- **High plausibility**: Plants grow fully, garden becomes vibrant and healthy
- **Medium plausibility**: Partial growth, plants look weaker
- **Low plausibility**: No growth, existing plants may wilt and decay

The system never judges quality—only whether real work likely happened. Over time, honest users unlock healthier gardens and rarer plants, while dishonest patterns naturally stall progression.

**Your garden becomes a living narrative of real discipline.**

---

## How we use Opik for online evaluation, performance tracking, and tracking performance across various LLMs

Bloom integrates **[Opik](https://www.comet.com/site/products/opik/)** for comprehensive AI observability and evaluation across all AI-powered features. Opik provides production-ready LLM monitoring with OpenTelemetry integration.

### 🔍 **What We Track with Opik**

Opik traces every AI operation in Bloom:

1. **Task Breakdown Generation** (`bloom:task-breakdown`)
   - Tracks how effectively AI converts vague tasks into actionable steps
   - Monitors model performance across different task complexities
   - Records user context (userId) for personalized insights

2. **Reflection Question Generation** (`bloom:reflection-question`)
   - Evaluates question quality and relevance to specific tasks
   - Tracks generation latency and token usage
   - Links questions to task metadata (taskId, effortWeight)

3. **Plausibility Evaluation** (`bloom:plausibility-evaluation`)
   - Monitors accuracy of honesty detection
   - Tracks scoring consistency across different task types
   - Captures reasoning for debugging edge cases

4. **Mood Response Generation** (`bloom:mood-response`)
   - Ensures responses match user emotional state appropriately
   - Tracks empathy and tone consistency

### 🎯 **Telemetry Architecture**

Every AI call includes rich telemetry context:

```typescript
// lib/ai/telemetry.ts
export function getAITelemetry(traceName: string, context?: TelemetryContext) {
  return OpikExporter.getSettings({
    name: `bloom:${traceName}`,
    metadata: {
      taskId: context?.taskId,
      userId: context?.userId,
      effortWeight: context?.effortWeight,
      threadId: context?.threadId,
    },
  });
}
```

This structured approach enables:
- **Trace-level debugging**: Inspect individual AI calls with full context
- **User journey analysis**: Track AI performance across entire user workflows
- **Metadata filtering**: Analyze performance by task difficulty, user behavior, etc.

### 🚀 **OpenTelemetry Integration**

Bloom uses Vercel's OpenTelemetry SDK with Opik's exporter for seamless instrumentation:

```typescript
// instrumentation.ts
import { registerOTel } from "@vercel/otel";
import { OpikExporter } from "opik-vercel";

export function register() {
  registerOTel({
    serviceName: "bloom",
    traceExporter: new OpikExporter({
      tags: ["bloom", "productivity", "ai-tasks"],
      metadata: {
        project: "bloom",
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
      },
    }),
  });
}
```

### 📊 **Multi-Model Performance Tracking**

While Bloom currently uses **Minimax M2.1** (via Anthropic's SDK and OpenCode proxy), the Opik integration is designed to support multi-model experimentation:

- **Model comparison**: Track performance metrics across different LLM providers
- **Cost analysis**: Monitor token usage and API costs per feature
- **Quality benchmarking**: Compare output quality between models for each task type
- **A/B testing**: Experiment with different models for specific features

The centralized AI configuration in `lib/ai/index.ts` makes it trivial to swap models or test multiple providers:

```typescript
export const aiModel = anthropic("minimax-m2.1-free");
// Easy to experiment: anthropic("claude-3-5-sonnet-20241022")
// or openai("gpt-4-turbo"), etc.
```

All model switches are automatically tracked through Opik's traces, enabling data-driven decisions about which models work best for each feature.

### 🎨 **Benefits of Opik Integration**

- **Production monitoring**: Real-time visibility into AI performance in production
- **Debugging**: Inspect failed generations with full prompt + response context
- **User experience**: Identify slow AI calls affecting UX
- **Cost optimization**: Track token usage to optimize prompts and reduce costs
- **Quality assurance**: Continuously evaluate AI output quality across all features

---

## MIT License

```
MIT License

Copyright (c) 2025 Bloom

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">
  <p>Built with ❤️ and one can of Monster</p>
</div>

import { createAnthropic } from "@ai-sdk/anthropic";

export const anthropic = createAnthropic({
  baseURL: "https://opencode.ai/zen/v1",
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Default model for all AI operations
export const aiModel = anthropic("minimax-m2.1-free");

import { ChatOpenAI } from "@langchain/openai";

// Initialize the OpenAI model with GPT-4
export const chatModel = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview", // Using GPT-4 Turbo
  temperature: 0.2, // Lower temperature for more factual responses
  maxTokens: 4096, // Adjust based on your needs
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Initialize a separate model for summarization
export const summaryModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo", // Using GPT-3.5 for cost efficiency on summaries
  temperature: 0.3,
  maxTokens: 1024,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

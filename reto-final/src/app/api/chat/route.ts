import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const systemPrompt = fs.readFileSync(
  path.join(process.cwd(), "src/data/chatbot-system-prompt.txt"),
  "utf-8"
);

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"];

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Filter to only user/assistant messages, ensure first message is from user
    const history = messages
      .slice(0, -1)
      .filter((msg: { role: string }) => msg.role === "user" || msg.role === "assistant")
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    // Ensure history starts with a user message (Gemini requirement)
    while (history.length > 0 && history[0].role === "model") {
      history.shift();
    }

    const lastMessage = messages[messages.length - 1];

    // Try models with retries — handles 503 overload errors
    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      for (const modelName of MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt,
          });

          const chat = model.startChat({ history });
          const result = await chat.sendMessage(lastMessage.content);
          const response = result.response.text();

          return Response.json({ message: response });
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.warn(`Model ${modelName} attempt ${attempt + 1} failed: ${errorMsg}`);
          const isRetryable = errorMsg.includes("503") || errorMsg.includes("high demand") || errorMsg.includes("no longer available") || errorMsg.includes("overloaded");
          if (!isRetryable) {
            throw err;
          }
        }
      }
      // Wait before retrying all models
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
      }
    }

    return Response.json({ error: "All models are currently unavailable. Please try again in a moment." }, { status: 503 });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}

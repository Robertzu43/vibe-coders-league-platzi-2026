import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const systemPrompt = fs.readFileSync(
  path.join(process.cwd(), "src/data/chatbot-system-prompt.txt"),
  "utf-8"
);

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response.text();

    return Response.json({ message: response });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}

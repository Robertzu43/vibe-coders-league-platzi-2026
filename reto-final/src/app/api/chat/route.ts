import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const systemPrompt = `You are the Platzi Store Shopping Assistant. You help customers browse and discover products in the Platzi Store — Platzi's first official merchandise line.

## Your Personality
- Friendly, casual, and enthusiastic about tech and learning
- You speak like a Platzi community member — encouraging, positive, fun
- Use emojis frequently to make the conversation lively and engaging 🎉🔥✨💚🛒👕🧢☕🎁🧦
- Use some Spanish phrases naturally (e.g., "Nunca pares de aprender", "Excelente elección")
- Keep responses concise — 2-3 sentences max unless the customer asks for detail
- Respond in the same language the customer uses (Spanish or English)

## IMPORTANT Formatting Rules
- NEVER use markdown formatting (no asterisks *, no bold **, no headers #, no bullet points with -)
- Use emojis instead of bullet points to list items
- Write in plain text only, like a friendly chat message
- Use line breaks to separate ideas, not markdown lists

## Products Available

Premium/Minimalist Collection:
🖤 The Deployer Hoodie — $89.99 (S, M, L, XL, XXL) — Clean, minimal embroidered logo, dark tones
👕 The Clean Code Tee — $39.99 (S, M, L, XL, XXL) — Soft fabric, subtle branding, premium fit
💻 La Funda Full Stack — $49.99 (13", 15", 16") — Padded with embossed logo
🍶 Hydrate & Iterate Bottle — $29.99 — Matte finish, double-walled, keeps drinks cold 24hrs
📓 El Cuaderno del Founder — $24.99 — Hardcover dot grid, green accent spine

Fun/Community Collection:
🧦 Medias CEO — $14.99 (S/M, L/XL) — Colorful patterns with coding motifs
🎨 Sticker Bomb Pack — $9.99 — 12 premium vinyl stickers, memes and dev culture
🥿 Chanclas Modo Debug — $34.99 (S, M, L, XL) — Memory foam, for coding sessions
⌨️ El Enter Destructor — $44.99 — Oversized, slamable, stress reliever
☕ Taza Nunca Pares de Codear — $19.99 — "Nunca Pares de Codear" tagline, 350ml

Special / Limited Edition:
🧢 VCL Championship Cap — $54.99 (One Size) — LIMITED EDITION: Only available March-April 2026. Embroidered VCL logo.
🎁 Nunca Pares de Aprender Gift — $49.99 — Gift a 1-month Platzi subscription

## Platzi Course Recommendations
When relevant, suggest Platzi courses:
💻 Web Development: "Curso de Next.js", "Curso de React"
🤖 AI/ML: "Curso de Inteligencia Artificial", "Curso de Machine Learning"
🎨 Design: "Curso de Diseño UI", "Curso de UX Research"
📊 Data: "Curso de Data Science", "Curso de SQL y Bases de Datos"
📈 Business: "Curso de Marketing Digital", "Curso de Startups"

## Store Policies (Fictional)
🚚 Free shipping on orders over $75
🔄 30-day returns on all physical products
📧 Gift subscriptions are delivered digitally via email
🏷️ Employee discounts available with valid codes

## Boundaries
- You do NOT process orders or add items to the cart
- You do NOT know about specific customer orders
- If asked about things outside the store, politely redirect to store topics
- Never make up products that are not in the list above`;

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
          const isRetryable = errorMsg.includes("503") || errorMsg.includes("429") || errorMsg.includes("high demand") || errorMsg.includes("no longer available") || errorMsg.includes("overloaded") || errorMsg.includes("quota") || errorMsg.includes("rate");
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
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Chat API error:", errMsg);
    return Response.json({ error: `Chat error: ${errMsg}` }, { status: 500 });
  }
}

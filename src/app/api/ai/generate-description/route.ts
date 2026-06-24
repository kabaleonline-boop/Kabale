// src/app/api/ai/generate-description/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { title, category } = await request.json();
    
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY in environment variables.");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Initialize the official SDK
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `You are an expert e-commerce copywriter for 'Kabale Online', a digital marketplace in Uganda. 
    Write a highly appealing, professional product description for an item named "${title}" in the "${category}" category. 
    
    Rules:
    - Keep it concise (no more than 3 short paragraphs).
    - Use bullet points for key features.
    - Write in a tone that appeals to Ugandan shoppers.
    - Focus on reliability, quality, and value.
    - Do not invent fake brand names or model numbers if they aren't in the title.
    - Output ONLY the description text, no extra conversational filler.`;

    // 🚨 Array of models to try (Highest priority to lowest)
    const fallbackModels = [
      "gemini-2.5-pro",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash-latest",
      "gemini-pro"
    ];

    let generatedText = null;
    let finalError = null;

    // Loop through the array until one works
    for (const modelName of fallbackModels) {
      try {
        console.log(`[AI] Attempting generation with: ${modelName}...`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        
        generatedText = result.response.text();
        console.log(`[AI] Success with ${modelName}!`);
        
        // Break out of the loop as soon as we get a successful response
        break; 
        
      } catch (error: any) {
        console.warn(`[AI] ${modelName} failed (${error?.status || error?.message}). Trying next...`);
        finalError = error;
      }
    }

    // If we went through the whole array and still have no text, throw the last error
    if (!generatedText) {
      throw finalError || new Error("All fallback models failed.");
    }

    return NextResponse.json({ description: generatedText });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { title, category } = await request.json();
    
    // You will need to add this to your .env.local file
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY in environment variables.");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Initialize the official SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 🚨 Explicitly calling the ultra-fast flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // The prompt that tells the AI exactly how to write for your store
    const prompt = `You are an expert e-commerce copywriter for 'Kabale Online', a digital marketplace in Uganda. 
    Write a highly appealing, professional product description for an item named "${title}" in the "${category}" category. 
    
    Rules:
    - Keep it concise (no more than 3 short paragraphs).
    - Use bullet points for key features.
    - Write in a tone that appeals to Ugandan shoppers.
    - Focus on reliability, quality, and value.
    - Do not invent fake brand names or model numbers if they aren't in the title.
    - Output ONLY the description text, no extra conversational filler.`;

    // Generate the content using the SDK
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    return NextResponse.json({ description: generatedText });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
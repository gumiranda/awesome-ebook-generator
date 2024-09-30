import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Função que gera uma única seção do capítulo com limite de 1024 tokens
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    const prompt = `I want you to act as a rewrite texts content creator focusing on brevity and impactful messaging. Your goal is to provide new, revealing, and exciting information while putting it into context and explaining "Why this is important." Start with a powerful hook in about six words to capture attention. Follow with a strong opening sentence that is memorable and clear. Provide context on why the information is important. Allow the reader to decide if they want to delve deeper into the topic. Concentrate on communicating with one person, aim for one key takeaway, and write in a simple, clear, and direct manner. Prioritize what you want the reader to remember and revise rigorously to eliminate unnecessary words. Write in portuguese. Use active voice, bold key phrases: \n\n"${text}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const sectionContent = completion.choices[0].message.content;
    return NextResponse.json({ sectionContent });
  } catch (error) {
    console.error("Error generating section", error);
    return NextResponse.json({ error: "Error generating section" });
  }
}

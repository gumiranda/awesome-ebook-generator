import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Função que gera uma única seção do capítulo com limite de 1024 tokens
export async function POST(request: NextRequest) {
  try {
    const { title, genre, description, chapter, section } =
      await request.json();

    const prompt = `Write section ${section} for chapter ${chapter} of a book titled "${title}" in the genre "${genre}" with the following description: "${description}". Limit the response to 1024 tokens.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const sectionContent = completion.choices[0].message.content;
    return NextResponse.json({ sectionContent });
  } catch (error) {
    console.error("Error generating section", error);
    return NextResponse.json({ error: "Error generating section" });
  }
}

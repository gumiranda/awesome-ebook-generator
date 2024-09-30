import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Função que gera uma única seção do capítulo com limite de 1024 tokens
export async function POST(request: NextRequest) {
  try {
    const { title, genre, description, chapter, section, previousSection } =
      await request.json();

    // Novo prompt com informações de continuidade
    const prompt = `
      Write section ${section} for chapter ${chapter} of a book titled "${title}" in the genre "${genre}".
      The book has the following description: "${description}". 
      
      Continue from the previous section: "${previousSection}".
      Ensure the new section flows naturally from the previous content, providing a smooth transition. 
      The section should hint at future developments to maintain reader engagement. 
      Limit the response to 1024 tokens.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const sectionContent = completion.choices[0].message.content;
    return NextResponse.json({ sectionContent });
  } catch (error) {
    console.error("Error generating section", error);
    return NextResponse.json({ error: "Error generating section" });
  }
}

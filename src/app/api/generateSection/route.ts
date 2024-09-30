import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Defina o custo por token (exemplo: $0.02 por 1000 tokens)
const COST_PER_MILLION_TOKENS = 2.5;

// Função que gera uma única seção do capítulo com limite de 1024 tokens
export async function POST(request: NextRequest) {
  try {
    const { title, genre, description, chapter, section, previousSection } =
      await request.json();

    // Novo prompt com informações de continuidade
    const prompt =
      chapter === 1 && section === 1
        ? `
    Write a book titled "${title}" in the genre "${genre}".
    The book has the following description: "${description}".   
  `
        : `
    Write section ${section} for chapter ${chapter} of a book titled "${title}" in the genre "${genre}".
    The book has the following description: "${description}". 
    
    Continue from the previous section: "${previousSection}".
    Ensure the new section flows naturally from the previous content, providing a smooth transition. 
    The section should hint at future developments to maintain reader engagement.  
  `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const sectionContent = completion.choices[0].message.content;

    // Calcule o número de tokens usados na resposta
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Calcule o custo total em dólares
    const costInDollars = (tokensUsed / 1_000_000) * COST_PER_MILLION_TOKENS;

    return NextResponse.json({ sectionContent, costInDollars });
  } catch (error) {
    console.error("Error generating section", error);
    return NextResponse.json({ error: "Error generating section" });
  }
}

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
    const { prompt } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
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

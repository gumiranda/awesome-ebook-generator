import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Defina o custo por token (exemplo: $2.50 por 1 milhão de tokens)
const COST_PER_MILLION_TOKENS = 2.5;
import { G4F } from "g4f";
const g4f = new G4F();
// Função que gera uma única seção do capítulo com limite de 1024 tokens
export async function POST(request: NextRequest) {
  try {
    const { promptRewrite, language, source } = await request.json();
    // const options = {
    //   provider: g4f.providers.GPT,
    //   model: "gpt-4",
    //   debug: true,
    //   proxy: "",
    // };
    const options = {
      text: promptRewrite,
      source: source,
      target: language,
    };

    // const messages = [{ role: "user", content: promptRewrite }];

    const text = await g4f.translation(options);
    // Construir o prompt com base no chunkIndex
    // Chamada à API da OpenAI
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o-2024-08-06",
    //   messages: [{ role: "user", content: promptRewrite }],
    //   temperature: 0.5,
    // });

    // const sectionContent = completion.choices[0].message.content;

    // // Calcule o número de tokens usados na resposta
    // const tokensUsed = completion.usage?.total_tokens || 0;

    // // Calcule o custo total em dólares
    // const costInDollars = (tokensUsed / 1_000_000) * COST_PER_MILLION_TOKENS;

    // return NextResponse.json({ sectionContent, costInDollars });
    return NextResponse.json({
      sectionContent: text?.translation?.result,
      costInDollars: 0,
    });
  } catch (error) {
    console.error("Error generating section", error);
    return NextResponse.json({ error: "Error generating section" });
  }
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  console.log("Request body", requestBody);
  const { title, genre, description, chapters } = requestBody;
  let bookContent = "";

  try {
    for (let i = 1; i <= chapters; i++) {
      const prompt = `Write chapter ${i} for a book titled "${title}" in the genre "${genre}" with the following description: "${description}". Make it detailed and long.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      console.log(completion.choices[0].message.content);
      bookContent += `\n\nChapter ${i}:\n\n${completion.choices[0].message.content}`;
      console.log("Generated chapter", i);
    }
    console.log("Generated book content", bookContent);
    return NextResponse.json({ content: bookContent });
  } catch (error) {
    console.error("Error generating book", error);
    return NextResponse.json({ message: "Error generating book", error });
  }
}

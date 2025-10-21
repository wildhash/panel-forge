import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

const GenerateCaptionsSchema = z.object({
  story: z.string(),
  artStyle: z.string(),
  panels: z.array(z.object({
    panelNumber: z.number(),
    imageUrl: z.string(),
  })),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    // Allow generation without auth for testing
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { story, artStyle, panels } = GenerateCaptionsSchema.parse(body);

    // Generate captions for all 3 panels
    const prompt = `You are a professional comic book writer. Generate concise, impactful captions for a 3-panel comic strip.

STORY: ${story}
ART STYLE: ${artStyle}

Create ONE caption for each panel. Each caption should:
- Be 1-2 short sentences maximum
- Match the comic's tone and style
- Progress the story (Setup → Action → Payoff)
- Work without seeing the image
- Be suitable for the panel position

Return ONLY a JSON array of exactly 3 strings, one for each panel.
Example format: ["Panel 1 caption here.", "Panel 2 caption here.", "Panel 3 caption here."]

DO NOT include any other text, explanations, or formatting. ONLY the JSON array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional comic book writer who creates concise, impactful captions. You respond ONLY with valid JSON arrays."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content || "[]";
    
    // Parse the JSON array
    let captions: string[];
    try {
      captions = JSON.parse(content);
      if (!Array.isArray(captions) || captions.length !== 3) {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to parse captions:", content);
      // Fallback captions
      captions = [
        "The story begins...",
        "The action unfolds...",
        "The story concludes."
      ];
    }

    return NextResponse.json({ captions });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Caption generation error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}





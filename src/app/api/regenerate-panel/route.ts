import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { buildPanelPrompt } from "@/lib/comic-continuity";

const RegeneratePanelSchema = z.object({
  panelNumber: z.number().min(1).max(3),
  story: z.string().min(10).max(500),
  artStyle: z.enum(['classic', 'manga', 'graphic-novel', 'retro-pulp', 'minimalist']),
  characterDescription: z.string().optional(),
  hasReferenceImages: z.boolean().default(false),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { panelNumber, story, artStyle, characterDescription, hasReferenceImages } = RegeneratePanelSchema.parse(body);

    // Build character token for consistency
    const characterToken = characterDescription || "the main character";

    // Determine the focus for this specific panel
    let panelFocus = "";
    switch (panelNumber) {
      case 1:
        panelFocus = `${story}. Panel 1: Setting the scene and introducing the situation.`;
        break;
      case 2:
        panelFocus = `${story}. Panel 2: The main action or conflict happening.`;
        break;
      case 3:
        panelFocus = `${story}. Panel 3: The conclusion or reaction to what happened.`;
        break;
    }

    // Generate the specific panel
    const prompt = buildPanelPrompt(
      panelNumber as 1 | 2 | 3,
      panelFocus,
      artStyle,
      characterToken
    );

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      });

      const imageUrl = response.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error(`Failed to regenerate panel ${panelNumber}`);
      }

      return NextResponse.json({
        success: true,
        panelNumber,
        imageUrl,
        message: `Panel ${panelNumber} regenerated successfully`
      });
    } catch (error: any) {
      console.error(`Panel ${panelNumber} regeneration error:`, error);
      return NextResponse.json(
        { error: `Failed to regenerate panel ${panelNumber}: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Panel regeneration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { buildThreePanelPrompts, buildCharacterToken } from "@/lib/comic-continuity";

const GenerateComicSchema = z.object({
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
    // Allow generation without auth for testing
    // In production, uncomment the following lines:
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { story, artStyle, characterDescription, hasReferenceImages } = GenerateComicSchema.parse(body);

    // Build character token for consistency
    const characterToken = buildCharacterToken(
      characterDescription || "the main character",
      hasReferenceImages
    );

    // Generate prompts for all 3 panels
    const panelPrompts = buildThreePanelPrompts(story, artStyle, characterToken);

    // Create a readable stream for real-time updates
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial status
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              progress: 0, 
              message: "Starting comic generation..." 
            })}\n\n`)
          );

          const panelUrls: string[] = [];

          // Generate each panel sequentially for better consistency
          for (let i = 0; i < 3; i++) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ 
                progress: (i * 33), 
                message: `Generating panel ${i + 1} of 3...`,
                panelNumber: i + 1
              })}\n\n`)
            );

            try {
              const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: panelPrompts[i],
                n: 1,
                size: "1024x1024",
                quality: "standard",
                style: "vivid"
              });

              const imageUrl = response.data?.[0]?.url;
              if (!imageUrl) {
                throw new Error(`Failed to generate panel ${i + 1}`);
              }

              panelUrls.push(imageUrl);

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ 
                  progress: ((i + 1) * 33), 
                  message: `Panel ${i + 1} complete!`,
                  panelNumber: i + 1,
                  imageUrl: imageUrl
                })}\n\n`)
              );
            } catch (error: any) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ 
                  error: true,
                  message: `Failed to generate panel ${i + 1}: ${error.message}`,
                  panelNumber: i + 1
                })}\n\n`)
              );
              throw error;
            }
          }

          // Send completion message
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              progress: 100, 
              message: "Comic strip complete!",
              complete: true,
              panels: panelUrls
            })}\n\n`)
          );

          controller.close();
        } catch (error: any) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              error: true,
              message: `Generation failed: ${error.message}`
            })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Comic generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


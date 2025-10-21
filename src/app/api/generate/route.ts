import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const GenerateRequestSchema = z.object({
  prompt: z.string().min(1),
  panelId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    GenerateRequestSchema.parse(body);

    // Simulate generation with streaming progress
    // In a real app, this would call an AI service like OpenAI DALL-E or Replicate
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Simulate progress updates
        const updates = [
          { progress: 0, message: "Starting generation..." },
          { progress: 25, message: "Processing prompt..." },
          { progress: 50, message: "Generating image..." },
          { progress: 75, message: "Finalizing..." },
          { progress: 100, message: "Complete!", imageUrl: "https://via.placeholder.com/400" },
        ];

        for (const update of updates) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        controller.close();
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
      return NextResponse.json({ error: "Invalid request", details: error.issues }, { status: 400 });
    }
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

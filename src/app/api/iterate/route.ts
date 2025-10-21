import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const IterateRequestSchema = z.object({
  panelId: z.string(),
  originalPrompt: z.string(),
  iterationPrompt: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { panelId } = IterateRequestSchema.parse(body);

    // Simulate iteration with streaming progress
    // In a real app, this would use the original image and iteration prompt
    // to generate a modified version
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const updates = [
          { progress: 0, message: "Loading original panel..." },
          { progress: 30, message: "Applying modifications..." },
          { progress: 60, message: "Generating iteration..." },
          { progress: 90, message: "Finalizing..." },
          { 
            progress: 100, 
            message: "Complete!", 
            imageUrl: "https://via.placeholder.com/400",
            panelId 
          },
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
    console.error("Iterate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

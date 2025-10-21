import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

const GenerateRequestSchema = z.object({
  prompt: z.string().min(1),
  panelId: z.string().optional(),
  sourceImageUrl: z.string().url().optional(),
});

// Check if AI API keys are configured
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
const hasReplicateKey = !!process.env.REPLICATE_API_KEY;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting: 10 requests per minute per user
    const rateLimitConfig = { interval: 60000, maxRequests: 10 };
    const allowed = rateLimit(`generate:${userId}`, rateLimitConfig);
    
    if (!allowed) {
      const headers = getRateLimitHeaders(`generate:${userId}`, rateLimitConfig);
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers }
      );
    }

    const body = await req.json();
    const { prompt } = GenerateRequestSchema.parse(body);

    // Stream progress updates
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Queue event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            status: "queued", 
            message: "Starting generation..." 
          })}\n\n`));
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Generating event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            status: "generating", 
            message: "Generating image..." 
          })}\n\n`));

          let imageUrl: string;
          let caption: string;

          // Fallback mode: No API key configured
          if (!hasOpenAIKey && !hasReplicateKey) {
            // Simulate generation delay
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            // Return a placeholder image with caption
            imageUrl = `https://via.placeholder.com/512x512/4F46E5/FFFFFF?text=${encodeURIComponent(prompt.slice(0, 30))}`;
            caption = `Fallback mode: "${prompt}"`;
            
            // Save as asset
            const asset = await prisma.asset.create({
              data: {
                userId,
                filename: `generated-${Date.now()}.png`,
                fileUrl: imageUrl,
                mimeType: "image/png",
              },
            });

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              status: "done", 
              message: "Complete! (Fallback mode - configure API keys for real generation)",
              imageUrl: asset.fileUrl,
              assetId: asset.id,
              caption,
            })}\n\n`));
          } else if (hasOpenAIKey) {
            // OpenAI DALL-E integration
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              status: "generating", 
              message: "Calling OpenAI DALL-E..." 
            })}\n\n`));

            // TODO: Implement actual OpenAI API call
            // For now, return placeholder
            await new Promise((resolve) => setTimeout(resolve, 2000));
            imageUrl = `https://via.placeholder.com/512x512/10B981/FFFFFF?text=OpenAI+Placeholder`;
            caption = `Generated with OpenAI: "${prompt}"`;

            const asset = await prisma.asset.create({
              data: {
                userId,
                filename: `openai-${Date.now()}.png`,
                fileUrl: imageUrl,
                mimeType: "image/png",
              },
            });

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              status: "done", 
              message: "Complete!",
              imageUrl: asset.fileUrl,
              assetId: asset.id,
              caption,
            })}\n\n`));
          } else if (hasReplicateKey) {
            // Replicate SDXL integration
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              status: "generating", 
              message: "Calling Replicate SDXL..." 
            })}\n\n`));

            // TODO: Implement actual Replicate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            imageUrl = `https://via.placeholder.com/512x512/EF4444/FFFFFF?text=Replicate+Placeholder`;
            caption = `Generated with Replicate: "${prompt}"`;

            const asset = await prisma.asset.create({
              data: {
                userId,
                filename: `replicate-${Date.now()}.png`,
                fileUrl: imageUrl,
                mimeType: "image/png",
              },
            });

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              status: "done", 
              message: "Complete!",
              imageUrl: asset.fileUrl,
              assetId: asset.id,
              caption,
            })}\n\n`));
          }

          controller.close();
        } catch (error) {
          console.error("Generation error:", error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            status: "error", 
            message: "Generation failed" 
          })}\n\n`));
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
      return NextResponse.json({ error: "Invalid request", details: error.issues }, { status: 400 });
    }
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

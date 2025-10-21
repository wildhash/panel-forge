import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const PlanRequestSchema = z.object({
  comicId: z.string(),
  description: z.string().min(1),
  numPanels: z.number().int().min(1).max(12).default(4),
  assetIds: z.array(z.string()).optional(),
  gridLayout: z.enum(["2x2", "3x3", "1x4", "4x1"]).default("2x2"),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { comicId, description, numPanels, assetIds, gridLayout } = PlanRequestSchema.parse(body);

    // Verify comic ownership
    const comic = await prisma.comic.findUnique({
      where: { id: comicId },
    });

    if (!comic || comic.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get next page number
    const existingPages = await prisma.page.findMany({
      where: { comicId },
      orderBy: { pageNum: "desc" },
      take: 1,
    });
    const nextPageNum = existingPages.length > 0 ? existingPages[0].pageNum + 1 : 1;

    // Create the page
    const page = await prisma.page.create({
      data: {
        comicId,
        pageNum: nextPageNum,
      },
    });

    // Create panels with layout
    const panels = [];
    for (let i = 0; i < numPanels; i++) {
      const panelNum = i + 1;
      const assetId = assetIds?.[i];
      let imageUrl: string | undefined;

      // Get asset URL if assetId provided
      if (assetId) {
        const asset = await prisma.asset.findFirst({
          where: { id: assetId, userId },
        });
        if (asset) {
          imageUrl = asset.fileUrl;
        }
      }

      const panel = await prisma.panel.create({
        data: {
          pageId: page.id,
          panelNum,
          imageUrl,
          prompt: `Panel ${panelNum}: ${description}`,
        },
      });
      panels.push(panel);
    }

    // Create initial revision
    await prisma.revision.create({
      data: {
        pageId: page.id,
        snapshot: JSON.stringify({
          description,
          gridLayout,
          panels: panels.map(p => ({
            panelNum: p.panelNum,
            imageUrl: p.imageUrl,
            prompt: p.prompt,
          })),
        }),
      },
    });

    // Return the plan
    const plan = {
      pageId: page.id,
      pageNum: nextPageNum,
      gridLayout,
      panels: panels.map(p => ({
        id: p.id,
        panelNum: p.panelNum,
        imageUrl: p.imageUrl,
        prompt: p.prompt,
        description: `Panel ${p.panelNum} based on: ${description}`,
        suggestedPrompt: `Generate panel ${p.panelNum} showing ${description}`,
      })),
    };

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: error.issues }, { status: 400 });
    }
    console.error("Plan error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

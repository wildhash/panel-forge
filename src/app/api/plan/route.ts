import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const PlanRequestSchema = z.object({
  description: z.string().min(1),
  numPanels: z.number().int().min(1).max(12).default(4),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { description, numPanels } = PlanRequestSchema.parse(body);

    // Simulate planning logic
    const plan = {
      panels: Array.from({ length: numPanels }, (_, i) => ({
        panelNum: i + 1,
        description: `Panel ${i + 1} based on: ${description}`,
        suggestedPrompt: `Generate panel ${i + 1} showing ${description}`,
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

"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const CreateComicSchema = z.object({
  title: z.string().min(1).max(255),
});

const SavePageSchema = z.object({
  comicId: z.string(),
  pageNum: z.number().int().min(1),
  panels: z.array(
    z.object({
      panelNum: z.number().int().min(1),
      imageUrl: z.string().url().optional(),
      prompt: z.string().optional(),
      balloons: z.string().optional(), // JSON string
    })
  ),
});

const SavePanelSchema = z.object({
  pageId: z.string(),
  panelNum: z.number().int().min(1),
  imageUrl: z.string().url().optional(),
  prompt: z.string().optional(),
  balloons: z.string().optional(),
});

export async function createComic(data: z.infer<typeof CreateComicSchema>) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { title } = CreateComicSchema.parse(data);

  const comic = await prisma.comic.create({
    data: {
      userId,
      title,
    },
  });

  revalidatePath("/studio");
  return { success: true, comic };
}

export async function savePage(data: z.infer<typeof SavePageSchema>) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { comicId, pageNum, panels } = SavePageSchema.parse(data);

  // Verify comic ownership
  const comic = await prisma.comic.findUnique({
    where: { id: comicId },
  });

  if (!comic || comic.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Upsert page
  const page = await prisma.page.upsert({
    where: {
      comicId_pageNum: {
        comicId,
        pageNum,
      },
    },
    update: {
      updatedAt: new Date(),
    },
    create: {
      comicId,
      pageNum,
    },
  });

  // Save all panels
  for (const panelData of panels) {
    await prisma.panel.upsert({
      where: {
        pageId_panelNum: {
          pageId: page.id,
          panelNum: panelData.panelNum,
        },
      },
      update: {
        imageUrl: panelData.imageUrl,
        prompt: panelData.prompt,
        balloons: panelData.balloons,
        updatedAt: new Date(),
      },
      create: {
        pageId: page.id,
        panelNum: panelData.panelNum,
        imageUrl: panelData.imageUrl,
        prompt: panelData.prompt,
        balloons: panelData.balloons,
      },
    });
  }

  // Create revision
  await prisma.revision.create({
    data: {
      pageId: page.id,
      snapshot: JSON.stringify({ panels }),
    },
  });

  revalidatePath("/studio");
  return { success: true, page };
}

export async function savePanel(data: z.infer<typeof SavePanelSchema>) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { pageId, panelNum, imageUrl, prompt, balloons } = SavePanelSchema.parse(data);

  // Verify page ownership through comic
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { comic: true },
  });

  if (!page || page.comic.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const panel = await prisma.panel.upsert({
    where: {
      pageId_panelNum: {
        pageId,
        panelNum,
      },
    },
    update: {
      imageUrl,
      prompt,
      balloons,
      updatedAt: new Date(),
    },
    create: {
      pageId,
      panelNum,
      imageUrl,
      prompt,
      balloons,
    },
  });

  revalidatePath("/studio");
  return { success: true, panel };
}

export async function getComics() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const comics = await prisma.comic.findMany({
    where: { userId },
    include: {
      pages: {
        include: {
          panels: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return comics;
}

const CreateAssetSchema = z.object({
  filename: z.string(),
  fileUrl: z.string().url(),
  fileKey: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().int().optional(),
});

export async function createAsset(data: z.infer<typeof CreateAssetSchema>) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { filename, fileUrl, fileKey, mimeType, size } = CreateAssetSchema.parse(data);

  const asset = await prisma.asset.create({
    data: {
      userId,
      filename,
      fileUrl,
      fileKey,
      mimeType,
      size,
    },
  });

  revalidatePath("/studio");
  return { success: true, asset };
}

export async function getAssets() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const assets = await prisma.asset.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return assets;
}

const CreateRevisionSchema = z.object({
  pageId: z.string(),
  snapshot: z.record(z.string(), z.unknown()),
});

export async function createRevision(data: z.infer<typeof CreateRevisionSchema>) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { pageId, snapshot } = CreateRevisionSchema.parse(data);

  // Verify page ownership
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { comic: true },
  });

  if (!page || page.comic.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const revision = await prisma.revision.create({
    data: {
      pageId,
      snapshot: JSON.stringify(snapshot),
    },
  });

  return { success: true, revision };
}

export async function getRevisions(pageId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify page ownership
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { comic: true },
  });

  if (!page || page.comic.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const revisions = await prisma.revision.findMany({
    where: { pageId },
    orderBy: { createdAt: "desc" },
    take: 10, // Last 10 revisions
  });

  return revisions;
}

export async function applyRevision(revisionId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const revision = await prisma.revision.findUnique({
    where: { id: revisionId },
    include: {
      page: {
        include: { comic: true },
      },
    },
  });

  if (!revision || revision.page.comic.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Parse the snapshot
  const snapshot = JSON.parse(revision.snapshot);
  const panels = snapshot.panels || [];

  // Apply the snapshot to the page
  for (const panelData of panels) {
    await prisma.panel.upsert({
      where: {
        pageId_panelNum: {
          pageId: revision.pageId,
          panelNum: panelData.panelNum,
        },
      },
      update: {
        imageUrl: panelData.imageUrl,
        prompt: panelData.prompt,
        balloons: panelData.balloons,
      },
      create: {
        pageId: revision.pageId,
        panelNum: panelData.panelNum,
        imageUrl: panelData.imageUrl,
        prompt: panelData.prompt,
        balloons: panelData.balloons,
      },
    });
  }

  revalidatePath("/studio");
  return { success: true };
}

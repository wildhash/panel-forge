"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveComic(data: {
  title: string;
  description?: string;
  artStyle: string;
  characterReference?: string;
  panels: Array<{
    panelNum: number;
    imageUrl: string;
    prompt?: string;
    caption?: string;
  }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Create comic with first page and panels
  const comic = await prisma.comic.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      artStyle: data.artStyle,
      characterReference: data.characterReference,
      status: "completed",
      thumbnailUrl: data.panels[0]?.imageUrl || null,
      panelCount: data.panels.length,
      pages: {
        create: {
          pageNum: 1,
          stripOrder: 1,
          panels: {
            create: data.panels.map(panel => ({
              panelNum: panel.panelNum,
              imageUrl: panel.imageUrl,
              prompt: panel.prompt,
              caption: panel.caption,
            })),
          },
        },
      },
    },
    include: {
      pages: {
        include: {
          panels: true,
        },
      },
    },
  });

  revalidatePath("/novels");
  return comic;
}

export async function getAllComics() {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  const comics = await prisma.comic.findMany({
    where: { userId },
    include: {
      pages: {
        include: {
          panels: {
            orderBy: { panelNum: "asc" },
          },
        },
        orderBy: { stripOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return comics;
}

export async function getComic(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const comic = await prisma.comic.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      pages: {
        include: {
          panels: {
            orderBy: { panelNum: "asc" },
          },
        },
        orderBy: { stripOrder: "asc" },
      },
    },
  });

  return comic;
}

export async function deleteComic(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.comic.delete({
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/novels");
}

export async function addStripToComic(comicId: string, panels: Array<{
  panelNum: number;
  imageUrl: string;
  prompt?: string;
  caption?: string;
}>) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get the comic and find the next strip order
  const comic = await prisma.comic.findFirst({
    where: { id: comicId, userId },
    include: { pages: true },
  });

  if (!comic) {
    throw new Error("Comic not found");
  }

  const nextStripOrder = Math.max(...comic.pages.map(p => p.stripOrder), 0) + 1;

  // Add new page/strip
  const page = await prisma.page.create({
    data: {
      comicId,
      pageNum: nextStripOrder, // Use stripOrder as pageNum for simplicity
      stripOrder: nextStripOrder,
      panels: {
        create: panels.map(panel => ({
          panelNum: panel.panelNum,
          imageUrl: panel.imageUrl,
          prompt: panel.prompt,
          caption: panel.caption,
        })),
      },
    },
    include: {
      panels: true,
    },
  });

  // Update comic panel count
  await prisma.comic.update({
    where: { id: comicId },
    data: {
      panelCount: comic.panelCount + panels.length,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/novels");
  revalidatePath(`/novels/${comicId}`);
  return page;
}





import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo user ID (in dev mode without auth)
  const demoUserId = "demo-user";

  // Create a demo comic
  const comic = await prisma.comic.create({
    data: {
      userId: demoUserId,
      title: "My First Comic Adventure",
    },
  });

  console.log(`✅ Created comic: ${comic.title}`);

  // Create a demo page
  const page = await prisma.page.create({
    data: {
      comicId: comic.id,
      pageNum: 1,
    },
  });

  console.log(`✅ Created page ${page.pageNum}`);

  // Create demo panels with placeholder images
  const panelData = [
    {
      panelNum: 1,
      prompt: "A hero standing on a cliff at sunrise",
      imageUrl: "https://via.placeholder.com/512x512/4F46E5/FFFFFF?text=Panel+1",
      balloons: JSON.stringify([
        { id: "1", text: "A new adventure begins!", x: 50, y: 20, w: 120, h: 60 },
      ]),
    },
    {
      panelNum: 2,
      prompt: "The hero walking through a mysterious forest",
      imageUrl: "https://via.placeholder.com/512x512/10B981/FFFFFF?text=Panel+2",
      balloons: JSON.stringify([
        { id: "2", text: "What lies ahead?", x: 50, y: 80, w: 100, h: 50 },
      ]),
    },
    {
      panelNum: 3,
      prompt: "Encountering a magical creature",
      imageUrl: "https://via.placeholder.com/512x512/F59E0B/FFFFFF?text=Panel+3",
      balloons: JSON.stringify([
        { id: "3", text: "Greetings, traveler!", x: 30, y: 30, w: 110, h: 55 },
        { id: "4", text: "Who are you?", x: 70, y: 70, w: 90, h: 50 },
      ]),
    },
    {
      panelNum: 4,
      prompt: "The hero and creature become friends",
      imageUrl: "https://via.placeholder.com/512x512/EF4444/FFFFFF?text=Panel+4",
      balloons: JSON.stringify([
        { id: "5", text: "Let's journey together!", x: 50, y: 50, w: 130, h: 60 },
      ]),
    },
  ];

  for (const data of panelData) {
    await prisma.panel.create({
      data: {
        ...data,
        pageId: page.id,
      },
    });
  }

  console.log(`✅ Created ${panelData.length} panels`);

  // Create a revision snapshot
  await prisma.revision.create({
    data: {
      pageId: page.id,
      snapshot: JSON.stringify({
        description: "Demo comic page",
        panels: panelData,
      }),
    },
  });

  console.log("✅ Created initial revision");

  // Create some demo assets
  const assetData = [
    {
      filename: "hero-portrait.png",
      fileUrl: "https://via.placeholder.com/512x512/6366F1/FFFFFF?text=Hero",
      mimeType: "image/png",
    },
    {
      filename: "forest-background.png",
      fileUrl: "https://via.placeholder.com/512x512/059669/FFFFFF?text=Forest",
      mimeType: "image/png",
    },
    {
      filename: "creature-sprite.png",
      fileUrl: "https://via.placeholder.com/512x512/DC2626/FFFFFF?text=Creature",
      mimeType: "image/png",
    },
  ];

  for (const data of assetData) {
    await prisma.asset.create({
      data: {
        ...data,
        userId: demoUserId,
      },
    });
  }

  console.log(`✅ Created ${assetData.length} demo assets`);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

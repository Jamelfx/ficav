import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a fresh PrismaClient instance
const prisma = new PrismaClient();

// POST - Initialize settings with hero image
export async function POST() {
  try {
    const heroImageUrl = "/images/uploads/hero-1773709926301-482133864_666297602630028_6469928392226197982_n__1_.png";

    // Use raw SQL to check and create/update settings
    const existingSettings = await prisma.$queryRaw`SELECT * FROM FederationSettings LIMIT 1`;
    
    if (Array.isArray(existingSettings) && existingSettings.length > 0) {
      // Update existing settings
      await prisma.$executeRaw`UPDATE FederationSettings SET heroImageUrl = ${heroImageUrl}, updatedAt = datetime('now')`;
      return NextResponse.json({ success: true, message: "Settings updated", heroImageUrl });
    } else {
      // Create new settings using raw SQL
      await prisma.$executeRaw`
        INSERT INTO FederationSettings (id, logoUrl, logoWidth, logoHeight, primaryColor, secondaryColor, accentColor, heroTitle, heroSubtitle, heroDescription, heroImageUrl, createdAt, updatedAt)
        VALUES (
          'default-ficav-settings',
          '/images/logo-ficav-official.png',
          48,
          48,
          '#F97316',
          '#FFFFFF',
          '#000000',
          'Fédération Ivoirienne du Cinéma et de l''Audiovisuel',
          'Le rendez-vous du cinéma ivoirien',
          'FICAV regroupe les associations de professionnels du cinéma et de l''audiovisuel en Côte d''Ivoire.',
          ${heroImageUrl},
          datetime('now'),
          datetime('now')
        )
      `;
      return NextResponse.json({ success: true, message: "Settings created", heroImageUrl });
    }
  } catch (error) {
    console.error("Error initializing settings:", error);
    return NextResponse.json({ error: "Error initializing settings: " + String(error) }, { status: 500 });
  }
}

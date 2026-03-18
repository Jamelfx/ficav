import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Retrieve all site content or specific section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    // Get settings
    let settings = null;
    if (db.federationSettings) {
      settings = await db.federationSettings.findFirst();
    }

    // Get specific section content
    if (section) {
      if (!db.siteContent) {
        return NextResponse.json(null);
      }
      const content = await db.siteContent.findUnique({
        where: { section },
      });
      return NextResponse.json(content);
    }

    // Get all content sections
    let allContent = [];
    if (db.siteContent) {
      allContent = await db.siteContent.findMany();
    }

    // Get albums for gallery
    let albums = [];
    if (db.galleryAlbum) {
      albums = await db.galleryAlbum.findMany({
        where: { isPublished: true },
        include: {
          photos: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      });
    }

    // Get news
    let news = [];
    if (db.news) {
      news = await db.news.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 10,
      });
    }

    return NextResponse.json({
      settings: settings || {
        logoUrl: "/images/logo-ficav-official.png",
        primaryColor: "#F97316",
        secondaryColor: "#FFFFFF",
        accentColor: "#000000",
        heroTitle: "Fédération Ivoirienne du Cinéma et de l'Audiovisuel",
        heroSubtitle: "Le rendez-vous du cinéma ivoirien",
        heroDescription: "FICAV regroupe les associations de professionnels du cinéma et de l'audiovisuel en Côte d'Ivoire.",
      },
      content: allContent,
      albums,
      news,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du contenu" },
      { status: 500 }
    );
  }
}

// PUT - Update settings or content section
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, section, content, ...settingsData } = data;

    // Update settings
    if (type === "settings" && db.federationSettings) {
      let settings = await db.federationSettings.findFirst();

      if (settings) {
        settings = await db.federationSettings.update({
          where: { id: settings.id },
          data: {
            logoUrl: settingsData.logoUrl,
            logoWidth: settingsData.logoWidth,
            logoHeight: settingsData.logoHeight,
            primaryColor: settingsData.primaryColor,
            secondaryColor: settingsData.secondaryColor,
            accentColor: settingsData.accentColor,
            email: settingsData.email,
            phone: settingsData.phone,
            address: settingsData.address,
            facebook: settingsData.facebook,
            twitter: settingsData.twitter,
            youtube: settingsData.youtube,
            instagram: settingsData.instagram,
            linkedin: settingsData.linkedin,
            heroTitle: settingsData.heroTitle,
            heroSubtitle: settingsData.heroSubtitle,
            heroDescription: settingsData.heroDescription,
            heroImageUrl: settingsData.heroImageUrl,
          },
        });
      } else {
        settings = await db.federationSettings.create({
          data: {
            logoUrl: settingsData.logoUrl,
            logoWidth: settingsData.logoWidth,
            logoHeight: settingsData.logoHeight,
            primaryColor: settingsData.primaryColor,
            secondaryColor: settingsData.secondaryColor,
            accentColor: settingsData.accentColor,
            email: settingsData.email,
            phone: settingsData.phone,
            address: settingsData.address,
            facebook: settingsData.facebook,
            twitter: settingsData.twitter,
            youtube: settingsData.youtube,
            instagram: settingsData.instagram,
            linkedin: settingsData.linkedin,
            heroTitle: settingsData.heroTitle,
            heroSubtitle: settingsData.heroSubtitle,
            heroDescription: settingsData.heroDescription,
            heroImageUrl: settingsData.heroImageUrl,
          },
        });
      }
      return NextResponse.json({ success: true, settings });
    }

    // Update section content
    if (type === "content" && section && db.siteContent) {
      let siteContent = await db.siteContent.findUnique({
        where: { section },
      });

      if (siteContent) {
        siteContent = await db.siteContent.update({
          where: { section },
          data: {
            content: typeof content === "string" ? content : JSON.stringify(content),
          },
        });
      } else {
        siteContent = await db.siteContent.create({
          data: {
            section,
            content: typeof content === "string" ? content : JSON.stringify(content),
          },
        });
      }
      return NextResponse.json({ success: true, content: siteContent });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du contenu" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Retrieve federation settings
export async function GET() {
  try {
    // Use raw SQL to get settings
    const settings = await db.$queryRaw`SELECT * FROM FederationSettings LIMIT 1`;
    
    if (Array.isArray(settings) && settings.length > 0) {
      return NextResponse.json(settings[0]);
    }

    // Return default settings if none exist
    return NextResponse.json({
      logoUrl: "/images/logo-ficav-official.png",
      logoWidth: 48,
      logoHeight: 48,
      primaryColor: "#F97316",
      secondaryColor: "#FFFFFF",
      accentColor: "#000000",
      email: "contact@ficav.ci",
      phone: "+225 07 00 00 00 00",
      address: "Immeuble FICAV, Plateau, Abidjan, Côte d'Ivoire",
      facebook: "",
      twitter: "",
      youtube: "",
      instagram: "",
      linkedin: "",
      heroTitle: "Fédération Ivoirienne du Cinéma et de l'Audiovisuel",
      heroSubtitle: "Le rendez-vous du cinéma ivoirien",
      heroDescription: "FICAV regroupe les associations de professionnels du cinéma et de l'audiovisuel en Côte d'Ivoire.",
      heroImageUrl: "",
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des paramètres" },
      { status: 500 }
    );
  }
}

// PUT - Update federation settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Check if settings exist
    const existingSettings = await db.$queryRaw`SELECT id FROM FederationSettings LIMIT 1`;
    
    const fields = [
      'logoUrl', 'logoWidth', 'logoHeight', 'primaryColor', 'secondaryColor', 'accentColor',
      'email', 'phone', 'address', 'facebook', 'twitter', 'youtube', 'instagram', 'linkedin',
      'heroTitle', 'heroSubtitle', 'heroDescription', 'heroImageUrl'
    ];

    if (Array.isArray(existingSettings) && existingSettings.length > 0) {
      // Update existing settings
      const setClauses = fields.map(f => `${f} = ?`).join(', ');
      const values = fields.map(f => data[f] ?? null);
      
      await db.$executeRawUnsafe(
        `UPDATE FederationSettings SET ${setClauses}, updatedAt = datetime('now')`,
        ...values
      );
      
      const updated = await db.$queryRaw`SELECT * FROM FederationSettings LIMIT 1`;
      return NextResponse.json(Array.isArray(updated) ? updated[0] : updated);
    } else {
      // Create new settings
      const placeholders = fields.map(() => '?').join(', ');
      const values = fields.map(f => data[f] ?? null);
      
      await db.$executeRawUnsafe(
        `INSERT INTO FederationSettings (id, ${fields.join(', ')}, createdAt, updatedAt) VALUES ('default-ficav-settings', ${placeholders}, datetime('now'), datetime('now'))`,
        ...values
      );
      
      const created = await db.$queryRaw`SELECT * FROM FederationSettings LIMIT 1`;
      return NextResponse.json(Array.isArray(created) ? created[0] : created);
    }
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des paramètres" },
      { status: 500 }
    );
  }
}

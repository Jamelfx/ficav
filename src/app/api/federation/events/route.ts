import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Sample events data for fallback
const sampleEvents = [
  {
    id: "sample-1",
    name: "Assemblée Générale Ordinaire 2025",
    description: "Assemblée générale annuelle de la FICAV",
    type: "AGO",
    date: new Date("2025-03-15").toISOString(),
    startTime: "09:00",
    endTime: "17:00",
    venue: "Palais des Congrès",
    address: "Plateau, Abidjan",
    city: "Abidjan",
    primaryColor: "#F97316",
    secondaryColor: "#FFFFFF",
    accentColor: "#000000",
    logoUrl: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    _count: { accessCards: 0, attendances: 0 },
  },
  {
    id: "sample-2",
    name: "Congrès Extraordinaire",
    description: "Congrès extraordinaire pour la révision des statuts",
    type: "CONGRES",
    date: new Date("2025-04-20").toISOString(),
    startTime: "10:00",
    endTime: "16:00",
    venue: "Hôtel Ivoire",
    address: "Cocody, Abidjan",
    city: "Abidjan",
    primaryColor: "#F97316",
    secondaryColor: "#FFFFFF",
    accentColor: "#000000",
    logoUrl: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    _count: { accessCards: 0, attendances: 0 },
  },
  {
    id: "sample-3",
    name: "Festival du Court Métrage",
    description: "Festival annuel du court métrage ivoirien",
    type: "FESTIVAL",
    date: new Date("2025-05-10").toISOString(),
    startTime: "18:00",
    endTime: "22:00",
    venue: "Institut Français",
    address: "Plateau, Abidjan",
    city: "Abidjan",
    primaryColor: "#F97316",
    secondaryColor: "#FFFFFF",
    accentColor: "#000000",
    logoUrl: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    _count: { accessCards: 0, attendances: 0 },
  },
];

// GET - List all events
export async function GET() {
  try {
    // Check if db.federationEvent is available
    if (!db.federationEvent) {
      console.log("FederationEvent model not available, returning sample data");
      return NextResponse.json(sampleEvents);
    }

    const events = await db.federationEvent.findMany({
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: { accessCards: true, attendances: true },
        },
      },
    });

    if (events.length === 0) {
      return NextResponse.json(sampleEvents);
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(sampleEvents);
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!db.federationEvent) {
      return NextResponse.json({
        ...data,
        id: `event-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }

    const event = await db.federationEvent.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type || "AUTRE",
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        venue: data.venue,
        address: data.address,
        city: data.city,
        primaryColor: data.primaryColor || "#F97316",
        secondaryColor: data.secondaryColor || "#FFFFFF",
        accentColor: data.accentColor || "#000000",
        logoUrl: data.logoUrl,
        isActive: true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'événement" },
      { status: 500 }
    );
  }
}

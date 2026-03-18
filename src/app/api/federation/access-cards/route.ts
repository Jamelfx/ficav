import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Generate unique card ID
function generateCardId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "FICAV-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// GET - List access cards for an event
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json([]);
    }

    // Check if db.accessCard is available
    if (!db.accessCard) {
      console.log("AccessCard model not available, returning empty array");
      return NextResponse.json([]);
    }

    const cards = await db.accessCard.findMany({
      where: { eventId },
      include: {
        event: true,
        attendance: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching access cards:", error);
    return NextResponse.json([]);
  }
}

// POST - Create new access card
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!db.accessCard) {
      return NextResponse.json({
        ...data,
        id: `card-${Date.now()}`,
        cardId: generateCardId(),
        createdAt: new Date().toISOString(),
      });
    }

    // Get the next card number for this event
    const existingCards = await db.accessCard.findMany({
      where: { eventId: data.eventId },
      select: { cardNumber: true },
    });
    const nextNumber = existingCards.length > 0
      ? Math.max(...existingCards.map(c => c.cardNumber)) + 1
      : 1;

    const card = await db.accessCard.create({
      data: {
        cardId: generateCardId(),
        eventId: data.eventId,
        associationId: data.associationId,
        associationName: data.associationName,
        associationShortName: data.associationShortName || data.associationName.substring(0, 4).toUpperCase(),
        representativeFirstName: data.representativeFirstName,
        representativeLastName: data.representativeLastName,
        representativeFunction: data.representativeFunction,
        cardNumber: nextNumber,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        isActivated: data.isActivated ?? true,
      },
      include: { event: true },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error creating access card:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la carte" },
      { status: 500 }
    );
  }
}

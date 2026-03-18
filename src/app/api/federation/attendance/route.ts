import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - List attendances for an event
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json([]);
    }

    if (!db.eventAttendance) {
      return NextResponse.json([]);
    }

    const attendances = await db.eventAttendance.findMany({
      where: { eventId },
      include: {
        card: true,
      },
      orderBy: { scannedAt: "desc" },
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json([]);
  }
}

// POST - Record attendance (scan card)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const cardId = data.cardId;

    if (!cardId) {
      return NextResponse.json(
        { error: "Card ID requis" },
        { status: 400 }
      );
    }

    if (!db.accessCard || !db.eventAttendance) {
      return NextResponse.json({
        success: true,
        message: "Présence enregistrée (mode démo)",
      });
    }

    // Find the card
    const card = await db.accessCard.findUnique({
      where: { cardId },
      include: { event: true },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Carte non trouvée" },
        { status: 404 }
      );
    }

    // Check if already scanned
    const existingAttendance = await db.eventAttendance.findUnique({
      where: { cardId: card.id },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: "Carte déjà scannée", attendance: existingAttendance },
        { status: 400 }
      );
    }

    // Create attendance record
    const attendance = await db.eventAttendance.create({
      data: {
        eventId: card.eventId,
        cardId: card.id,
      },
      include: { card: true },
    });

    return NextResponse.json({
      success: true,
      message: "Présence enregistrée",
      attendance,
      card,
    });
  } catch (error) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la présence" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

// GET - Get all invitations (for Secretary General)
export async function GET() {
  try {
    const invitations = await db.$queryRaw`
      SELECT * FROM AssociationInvitation
      ORDER BY createdAt DESC
    `;

    return NextResponse.json({
      invitations: Array.isArray(invitations) ? invitations : [],
    });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des invitations" },
      { status: 500 }
    );
  }
}

// POST - Create and send invitation (for Secretary General)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      associationName, 
      associationShortName, 
      email, 
      membershipFee,
      firstCotisation,
      requirePayment = true 
    } = data;

    // Validate required fields
    if (!associationName || !associationShortName || !email) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires" },
        { status: 400 }
      );
    }

    // Check if invitation already exists for this email
    const existingInvitation = await db.$queryRaw`
      SELECT id FROM AssociationInvitation WHERE email = ${email}
    `;

    if (Array.isArray(existingInvitation) && existingInvitation.length > 0) {
      return NextResponse.json(
        { error: "Une invitation existe déjà pour cette adresse email" },
        { status: 400 }
      );
    }

    // Generate unique invitation token
    const invitationToken = randomBytes(32).toString("hex");

    // Create invitation
    await db.$executeRaw`
      INSERT INTO AssociationInvitation (
        id, associationName, associationShortName, email, invitationToken,
        membershipFee, firstCotisation, requirePayment, isAccepted, isPaid,
        sentAt, createdAt, updatedAt
      ) VALUES (
        ${`inv-${Date.now()}`},
        ${associationName},
        ${associationShortName},
        ${email},
        ${invitationToken},
        ${membershipFee || 50000},
        ${firstCotisation || null},
        ${requirePayment ? 1 : 0},
        0,
        0,
        datetime('now'),
        datetime('now'),
        datetime('now')
      )
    `;

    // In production, send email with invitation link
    // For now, just return the invitation URL
    const invitationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invitation/${invitationToken}`;

    return NextResponse.json({
      success: true,
      message: "Invitation envoyée avec succès",
      invitation: {
        associationName,
        associationShortName,
        email,
        invitationToken,
        invitationUrl,
      },
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'invitation" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel invitation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de l'invitation requis" },
        { status: 400 }
      );
    }

    await db.$executeRaw`
      DELETE FROM AssociationInvitation WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: "Invitation annulée",
    });
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de l'invitation" },
      { status: 500 }
    );
  }
}

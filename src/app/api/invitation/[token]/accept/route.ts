import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Accept invitation and create account
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const data = await request.json();
    const { password, email, associationName, associationShortName } = data;

    // Validate password
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // Get invitation
    const invitation = await db.$queryRaw`
      SELECT * FROM AssociationInvitation WHERE invitationToken = ${token}
    ` as Array<{
      id: string;
      email: string;
      associationName: string;
      associationShortName: string;
      isPaid: number;
      isAccepted: number;
      membershipFee: number;
    }>;

    if (!Array.isArray(invitation) || invitation.length === 0) {
      return NextResponse.json(
        { error: "Invitation non trouvée" },
        { status: 404 }
      );
    }

    const inv = invitation[0];

    // Check if payment is required and completed
    if (inv.membershipFee > 0 && inv.isPaid !== 1) {
      return NextResponse.json(
        { error: "Veuillez d'abord effectuer le paiement de votre adhésion" },
        { status: 400 }
      );
    }

    // Check if already accepted
    if (inv.isAccepted === 1) {
      return NextResponse.json(
        { error: "Cette invitation a déjà été acceptée" },
        { status: 400 }
      );
    }

    // Create slug from short name
    const slug = associationShortName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Create association
    const associationId = `asso-${Date.now()}`;
    await db.$executeRaw`
      INSERT INTO Association (
        id, slug, name, email, status, createdAt, updatedAt
      ) VALUES (
        ${associationId},
        ${slug},
        ${associationName},
        ${email},
        'ACTIVE',
        datetime('now'),
        datetime('now')
      )
    `;

    // Create membership record
    await db.$executeRaw`
      INSERT INTO AssociationMembership (
        id, associationId, amount, year, status, paidAt, createdAt, updatedAt
      ) VALUES (
        ${`mem-${Date.now()}`},
        ${associationId},
        ${inv.membershipFee},
        ${new Date().getFullYear()},
        'PAID',
        datetime('now'),
        datetime('now'),
        datetime('now')
      )
    `;

    // Create admin user for association
    const userId = `user-${Date.now()}`;
    // In production, hash the password properly
    const hashedPassword = password; // TODO: Use bcrypt in production

    await db.$executeRaw`
      INSERT INTO User (
        id, email, name, role, isVerified, associationId, createdAt, updatedAt
      ) VALUES (
        ${userId},
        ${email},
        ${`Admin ${associationShortName}`},
        'ADMIN_ASSOCIATION',
        1,
        ${associationId},
        datetime('now'),
        datetime('now')
      )
    `;

    // Update invitation as accepted
    await db.$executeRaw`
      UPDATE AssociationInvitation 
      SET isAccepted = 1, 
          acceptedAt = datetime('now'),
          updatedAt = datetime('now')
      WHERE invitationToken = ${token}
    `;

    return NextResponse.json({
      success: true,
      message: "Compte créé avec succès",
      user: {
        email,
        associationId,
        associationName,
      },
    });
  } catch (error) {
    console.error("Account creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}

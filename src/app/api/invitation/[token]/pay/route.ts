import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Process payment for invitation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const data = await request.json();
    const { method, phoneNumber, amount } = data;

    // Validate payment method
    if (!["orange_money", "wave", "bank_transfer", "cash"].includes(method)) {
      return NextResponse.json(
        { error: "Méthode de paiement invalide" },
        { status: 400 }
      );
    }

    // Get invitation
    const invitation = await db.$queryRaw`
      SELECT * FROM AssociationInvitation WHERE invitationToken = ${token}
    `;

    if (!Array.isArray(invitation) || invitation.length === 0) {
      return NextResponse.json(
        { error: "Invitation non trouvée" },
        { status: 404 }
      );
    }

    const inv = invitation[0] as {
      id: string;
      email: string;
      membershipFee: number;
    };

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Update invitation as paid
    await db.$executeRaw`
      UPDATE AssociationInvitation 
      SET isPaid = 1, 
          paidAt = datetime('now'),
          paymentMethod = ${method},
          transactionId = ${transactionId},
          updatedAt = datetime('now')
      WHERE invitationToken = ${token}
    `;

    return NextResponse.json({
      success: true,
      message: "Paiement effectué avec succès",
      transactionId,
      amount,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Erreur lors du paiement" },
      { status: 500 }
    );
  }
}

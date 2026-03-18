import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Get association payment info (membership and cotisations)
export async function GET() {
  try {
    // For demo purposes, return mock data
    // In production, get associationId from auth context
    const mockAssociationId = "demo-association";

    // Get membership info
    const membershipResult = await db.$queryRaw`
      SELECT * FROM AssociationMembership 
      WHERE associationId = ${mockAssociationId}
      LIMIT 1
    `;

    // Get cotisations
    const cotisationsResult = await db.$queryRaw`
      SELECT * FROM AssociationCotisation 
      WHERE associationId = ${mockAssociationId}
      ORDER BY year DESC, month ASC
    `;

    const currentYear = new Date().getFullYear();

    // If no membership exists, return default pending status
    if (!Array.isArray(membershipResult) || membershipResult.length === 0) {
      return NextResponse.json({
        membership: {
          isPaid: false,
          amount: 50000,
          paidAt: null,
          year: currentYear,
          status: "PENDING",
        },
        cotisations: [],
      });
    }

    const membership = membershipResult[0] as {
      id: string;
      amount: number;
      year: number;
      status: string;
      paidAt: string | null;
    };

    return NextResponse.json({
      membership: {
        isPaid: membership.status === "PAID",
        amount: membership.amount,
        paidAt: membership.paidAt,
        year: membership.year,
        status: membership.status,
      },
      cotisations: Array.isArray(cotisationsResult) ? cotisationsResult : [],
    });
  } catch (error) {
    console.error("Error fetching payment info:", error);
    
    // Return default data on error
    return NextResponse.json({
      membership: {
        isPaid: false,
        amount: 50000,
        paidAt: null,
        year: new Date().getFullYear(),
        status: "PENDING",
      },
      cotisations: [],
    });
  }
}

// POST - Process a payment
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, method, phoneNumber, amount } = data;

    // For demo purposes, use a mock association ID
    const mockAssociationId = "demo-association";
    const currentYear = new Date().getFullYear();

    // Validate payment type
    if (!["adhesion", "monthly", "annual"].includes(type)) {
      return NextResponse.json(
        { error: "Type de paiement invalide" },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!["orange_money", "wave", "bank_transfer", "cash"].includes(method)) {
      return NextResponse.json(
        { error: "Méthode de paiement invalide" },
        { status: 400 }
      );
    }

    // For mobile money, validate phone number
    if ((method === "orange_money" || method === "wave") && !phoneNumber) {
      return NextResponse.json(
        { error: "Numéro de téléphone requis pour ce moyen de paiement" },
        { status: 400 }
      );
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (type === "adhesion") {
      // Create or update membership payment
      const existingMembership = await db.$queryRaw`
        SELECT id FROM AssociationMembership WHERE associationId = ${mockAssociationId}
      `;

      if (Array.isArray(existingMembership) && existingMembership.length > 0) {
        await db.$executeRaw`
          UPDATE AssociationMembership 
          SET status = 'PAID', 
              paidAt = datetime('now'),
              paymentMethod = ${method},
              transactionId = ${transactionId},
              updatedAt = datetime('now')
          WHERE associationId = ${mockAssociationId}
        `;
      } else {
        await db.$executeRaw`
          INSERT INTO AssociationMembership (
            id, associationId, amount, year, status, paidAt, paymentMethod, transactionId, createdAt, updatedAt
          ) VALUES (
            ${`mem-${Date.now()}`}, ${mockAssociationId}, ${amount}, ${currentYear}, 'PAID', 
            datetime('now'), ${method}, ${transactionId}, datetime('now'), datetime('now')
          )
        `;
      }
    } else {
      // Create cotisation payment
      const cotisationType = type === "annual" ? "ANNUAL" : "MONTHLY";
      const month = type === "monthly" ? new Date().getMonth() + 1 : null;

      await db.$executeRaw`
        INSERT INTO AssociationCotisation (
          id, associationId, year, month, type, amount, status, dueDate, paidAt, paymentMethod, transactionId, createdAt, updatedAt
        ) VALUES (
          ${`cot-${Date.now()}`}, ${mockAssociationId}, ${currentYear}, ${month}, ${cotisationType},
          ${amount}, 'PAID', datetime('now'), datetime('now'), ${method}, ${transactionId}, datetime('now'), datetime('now')
        )
      `;
    }

    return NextResponse.json({
      success: true,
      transactionId,
      message: "Paiement effectué avec succès",
      amount,
      method,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du paiement" },
      { status: 500 }
    );
  }
}

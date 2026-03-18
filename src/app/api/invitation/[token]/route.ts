import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Get invitation details by token
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

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
      associationName: string;
      associationShortName: string;
      email: string;
      membershipFee: number;
      firstCotisation: number | null;
      requirePayment: number;
      isPaid: number;
      isAccepted: number;
      invitationToken: string;
    };

    return NextResponse.json({
      invitation: {
        id: inv.id,
        associationName: inv.associationName,
        associationShortName: inv.associationShortName,
        email: inv.email,
        membershipFee: inv.membershipFee,
        firstCotisation: inv.firstCotisation,
        requirePayment: inv.requirePayment === 1,
        isPaid: inv.isPaid === 1,
        isAccepted: inv.isAccepted === 1,
        invitationToken: inv.invitationToken,
      },
    });
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'invitation" },
      { status: 500 }
    );
  }
}

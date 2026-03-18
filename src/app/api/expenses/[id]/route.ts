import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ExpenseStatus } from "@prisma/client";

// GET - Get single expense
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const expense = await db.expense.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Dépense non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la dépense" },
      { status: 500 }
    );
  }
}

// PUT - Update expense
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      title: body.title,
      description: body.description,
      amount: parseFloat(body.amount),
      category: body.category,
      expenseDate: new Date(body.expenseDate),
      beneficiary: body.beneficiary,
      beneficiaryType: body.beneficiaryType,
      paymentMethod: body.paymentMethod,
      budgetLine: body.budgetLine,
      eventId: body.eventId,
      eventName: body.eventName,
    };

    if (body.paymentDate) {
      updateData.paymentDate = new Date(body.paymentDate);
    }

    if (body.status) {
      updateData.status = body.status;
      
      if (body.status === ExpenseStatus.APPROVED) {
        updateData.approvedAt = new Date();
      }
    }

    const expense = await db.expense.update({
      where: { id },
      data: updateData,
      include: {
        documents: true,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la dépense" },
      { status: 500 }
    );
  }
}

// DELETE - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First delete all documents
    await db.expenseDocument.deleteMany({
      where: { expenseId: id },
    });

    // Then delete the expense
    await db.expense.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la dépense" },
      { status: 500 }
    );
  }
}

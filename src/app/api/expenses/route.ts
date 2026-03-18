import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ExpenseCategory, ExpenseStatus } from "@prisma/client";

// GET - List all expenses with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filters
    const year = searchParams.get("year");
    const category = searchParams.get("category") as ExpenseCategory | null;
    const status = searchParams.get("status") as ExpenseStatus | null;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (year) {
      const yearNum = parseInt(year);
      where.expenseDate = {
        gte: new Date(yearNum, 0, 1),
        lte: new Date(yearNum, 11, 31, 23, 59, 59),
      };
    }
    
    if (startDate && endDate) {
      where.expenseDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    
    if (category) {
      where.category = category;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { beneficiary: { contains: search } },
        { reference: { contains: search } },
      ];
    }

    const [expenses, total] = await Promise.all([
      db.expense.findMany({
        where,
        include: {
          documents: true,
        },
        orderBy: {
          expenseDate: "desc",
        },
        skip,
        take: limit,
      }),
      db.expense.count({ where }),
    ]);

    // Calculate totals
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Group by category
    const byCategory = expenses.reduce((acc, e) => {
      const cat = e.category;
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += e.amount;
      return acc;
    }, {} as Record<string, number>);

    // Group by month
    const byMonth = expenses.reduce((acc, e) => {
      const month = new Date(e.expenseDate).toISOString().slice(0, 7);
      if (!acc[month]) acc[month] = 0;
      acc[month] += e.amount;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: {
        totalAmount,
        count: expenses.length,
        byCategory,
        byMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des dépenses" },
      { status: 500 }
    );
  }
}

// POST - Create new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate reference number
    const year = new Date().getFullYear();
    const count = await db.expense.count({
      where: {
        reference: {
          startsWith: `DEP-${year}`,
        },
      },
    });
    const reference = `DEP-${year}-${String(count + 1).padStart(4, "0")}`;

    const expense = await db.expense.create({
      data: {
        reference,
        title: body.title,
        description: body.description,
        amount: parseFloat(body.amount),
        currency: body.currency || "XOF",
        category: body.category || "OTHER",
        expenseDate: new Date(body.expenseDate),
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        status: body.status || "DRAFT",
        beneficiary: body.beneficiary,
        beneficiaryType: body.beneficiaryType,
        paymentMethod: body.paymentMethod,
        budgetLine: body.budgetLine,
        eventId: body.eventId,
        eventName: body.eventName,
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la dépense" },
      { status: 500 }
    );
  }
}

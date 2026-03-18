import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ExpenseCategory, ExpenseStatus } from "@prisma/client";

// Category labels in French
const categoryLabels: Record<ExpenseCategory, string> = {
  ADMINISTRATIVE: "Administratif",
  EVENT: "Événements",
  EQUIPMENT: "Équipements",
  COMMUNICATION: "Communication",
  TRANSPORT: "Transport",
  FORMATION: "Formation",
  LOGISTICS: "Logistique",
  SALARY: "Salaires",
  RENT: "Loyer",
  UTILITIES: "Factures",
  SUPPLIES: "Fournitures",
  OTHER: "Autres",
};

// Month labels in French
const monthLabels = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
];

// GET - Get expense statistics for charts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

    // Get all expenses for the year
    const expenses = await db.expense.findMany({
      where: {
        expenseDate: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59),
        },
        status: {
          not: ExpenseStatus.REJECTED,
        },
      },
      orderBy: {
        expenseDate: "asc",
      },
    });

    // Monthly data for line chart
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthExpenses = expenses.filter(
        (e) => new Date(e.expenseDate).getMonth() === i
      );
      return {
        month: monthLabels[i],
        monthIndex: i,
        amount: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
        count: monthExpenses.length,
      };
    });

    // Category data for bar chart
    const categoryData = Object.entries(
      expenses.reduce((acc, e) => {
        const cat = e.category;
        if (!acc[cat]) acc[cat] = 0;
        acc[cat] += e.amount;
        return acc;
      }, {} as Record<string, number>)
    ).map(([category, amount]) => ({
      category: categoryLabels[category as ExpenseCategory] || category,
      categoryKey: category,
      amount,
      fill: getCategoryColor(category as ExpenseCategory),
    }));

    // Status distribution
    const statusData = Object.entries(
      expenses.reduce((acc, e) => {
        const status = e.status;
        if (!acc[status]) acc[status] = 0;
        acc[status] += 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([status, count]) => ({
      status: getStatusLabel(status as ExpenseStatus),
      statusKey: status,
      count,
    }));

    // Calculate totals
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = expenses.length;

    // Quarterly data
    const quarterlyData = [
      { quarter: "T1", months: [0, 1, 2] },
      { quarter: "T2", months: [3, 4, 5] },
      { quarter: "T3", months: [6, 7, 8] },
      { quarter: "T4", months: [9, 10, 11] },
    ].map((q) => {
      const qExpenses = expenses.filter(
        (e) => q.months.includes(new Date(e.expenseDate).getMonth())
      );
      return {
        quarter: q.quarter,
        amount: qExpenses.reduce((sum, e) => sum + e.amount, 0),
        count: qExpenses.length,
      };
    });

    // Get cotisations (income) for comparison
    const cotisations = await db.cotisation.findMany({
      where: {
        year,
        status: "PAID",
      },
    });

    const totalIncome = cotisations.reduce((sum, c) => sum + c.amount, 0);
    const balance = totalIncome - totalAmount;

    // Monthly comparison (income vs expenses)
    const monthlyComparison = Array.from({ length: 12 }, (_, i) => {
      const monthExpenses = expenses.filter(
        (e) => new Date(e.expenseDate).getMonth() === i
      );
      // For now, distribute income evenly (in real app, would track payment dates)
      const monthIncome = totalIncome / 12;
      
      return {
        month: monthLabels[i],
        expenses: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
        income: Math.round(monthIncome),
      };
    });

    // Top expenses
    const topExpenses = expenses
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((e) => ({
        id: e.id,
        reference: e.reference,
        title: e.title,
        amount: e.amount,
        date: e.expenseDate,
        category: categoryLabels[e.category] || e.category,
      }));

    return NextResponse.json({
      year,
      summary: {
        totalExpenses,
        totalAmount,
        totalIncome,
        balance,
        averagePerMonth: totalAmount / 12,
      },
      charts: {
        monthly: monthlyData,
        byCategory: categoryData,
        byStatus: statusData,
        quarterly: quarterlyData,
        comparison: monthlyComparison,
      },
      topExpenses,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}

function getCategoryColor(category: ExpenseCategory): string {
  const colors: Record<ExpenseCategory, string> = {
    ADMINISTRATIVE: "#6366f1",
    EVENT: "#f59e0b",
    EQUIPMENT: "#10b981",
    COMMUNICATION: "#3b82f6",
    TRANSPORT: "#8b5cf6",
    FORMATION: "#ec4899",
    LOGISTICS: "#14b8a6",
    SALARY: "#f97316",
    RENT: "#64748b",
    UTILITIES: "#0ea5e9",
    SUPPLIES: "#84cc16",
    OTHER: "#a1a1aa",
  };
  return colors[category] || "#a1a1aa";
}

function getStatusLabel(status: ExpenseStatus): string {
  const labels: Record<ExpenseStatus, string> = {
    DRAFT: "Brouillon",
    PENDING_APPROVAL: "En attente",
    APPROVED: "Approuvé",
    REJECTED: "Rejeté",
    PAID: "Payé",
  };
  return labels[status] || status;
}

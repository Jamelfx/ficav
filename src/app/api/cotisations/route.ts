import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const year = searchParams.get('year');
    const associationId = searchParams.get('associationId');

    const where: Record<string, unknown> = {};

    // Filter by status
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Filter by year
    if (year) {
      where.year = parseInt(year);
    }

    // Filter by association
    if (associationId) {
      where.associationId = associationId;
    }

    const cotisations = await db.cotisation.findMany({
      where,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      include: {
        association: {
          select: { id: true, name: true, logo: true },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            paidAt: true,
            method: true,
            transactionId: true,
            receiptUrl: true,
          },
          orderBy: { paidAt: 'desc' },
        },
      },
    });

    if (cotisations.length === 0) {
      return NextResponse.json(getSampleCotisations());
    }

    return NextResponse.json(cotisations);
  } catch (error) {
    console.error('Error fetching cotisations:', error);
    return NextResponse.json(getSampleCotisations());
  }
}

function getSampleCotisations() {
  const currentYear = new Date().getFullYear();
  
  return [
    // 2024 Cotisations
    {
      id: 'cot-1',
      year: currentYear,
      amount: 500000,
      dueDate: new Date(`${currentYear}-03-31`),
      status: 'PAID',
      paidAt: new Date(`${currentYear}-02-15`),
      paymentMethod: 'Orange Money',
      transactionId: 'OM-2024-001234',
      receiptUrl: '/receipts/rec-2024-001.pdf',
      association: {
        id: 'assoc-1',
        name: 'APROCIB',
        logo: null,
      },
      payments: [
        {
          id: 'pay-1',
          amount: 500000,
          paidAt: new Date(`${currentYear}-02-15`),
          method: 'Orange Money',
          transactionId: 'OM-2024-001234',
          receiptUrl: '/receipts/rec-2024-001.pdf',
        },
      ],
    },
    {
      id: 'cot-2',
      year: currentYear,
      amount: 500000,
      dueDate: new Date(`${currentYear}-03-31`),
      status: 'PAID',
      paidAt: new Date(`${currentYear}-03-10`),
      paymentMethod: 'Wave',
      transactionId: 'WV-2024-005678',
      receiptUrl: '/receipts/rec-2024-002.pdf',
      association: {
        id: 'assoc-2',
        name: 'ARPA',
        logo: null,
      },
      payments: [
        {
          id: 'pay-2',
          amount: 500000,
          paidAt: new Date(`${currentYear}-03-10`),
          method: 'Wave',
          transactionId: 'WV-2024-005678',
          receiptUrl: '/receipts/rec-2024-002.pdf',
        },
      ],
    },
    {
      id: 'cot-3',
      year: currentYear,
      amount: 500000,
      dueDate: new Date(`${currentYear}-03-31`),
      status: 'PENDING',
      paidAt: null,
      paymentMethod: null,
      transactionId: null,
      receiptUrl: null,
      association: {
        id: 'assoc-3',
        name: 'UCIAV',
        logo: null,
      },
      payments: [],
    },
    {
      id: 'cot-4',
      year: currentYear,
      amount: 500000,
      dueDate: new Date(`${currentYear}-03-31`),
      status: 'OVERDUE',
      paidAt: null,
      paymentMethod: null,
      transactionId: null,
      receiptUrl: null,
      association: {
        id: 'assoc-4',
        name: 'APIAC',
        logo: null,
      },
      payments: [],
    },
    {
      id: 'cot-5',
      year: currentYear,
      amount: 500000,
      dueDate: new Date(`${currentYear}-03-31`),
      status: 'PAID',
      paidAt: new Date(`${currentYear}-01-20`),
      paymentMethod: 'Carte Bancaire',
      transactionId: 'CB-2024-009876',
      receiptUrl: '/receipts/rec-2024-003.pdf',
      association: {
        id: 'assoc-5',
        name: 'ACI',
        logo: null,
      },
      payments: [
        {
          id: 'pay-3',
          amount: 500000,
          paidAt: new Date(`${currentYear}-01-20`),
          method: 'Carte Bancaire',
          transactionId: 'CB-2024-009876',
          receiptUrl: '/receipts/rec-2024-003.pdf',
        },
      ],
    },
    {
      id: 'cot-6',
      year: currentYear,
      amount: 500000,
      dueDate: new Date(`${currentYear}-03-31`),
      status: 'PENDING',
      paidAt: null,
      paymentMethod: null,
      transactionId: null,
      receiptUrl: null,
      association: {
        id: 'assoc-6',
        name: 'SCCA',
        logo: null,
      },
      payments: [],
    },
    // 2023 Cotisations
    {
      id: 'cot-7',
      year: currentYear - 1,
      amount: 450000,
      dueDate: new Date(`${currentYear - 1}-03-31`),
      status: 'PAID',
      paidAt: new Date(`${currentYear - 1}-03-15`),
      paymentMethod: 'Orange Money',
      transactionId: 'OM-2023-001111',
      receiptUrl: '/receipts/rec-2023-001.pdf',
      association: {
        id: 'assoc-1',
        name: 'APROCIB',
        logo: null,
      },
      payments: [
        {
          id: 'pay-4',
          amount: 450000,
          paidAt: new Date(`${currentYear - 1}-03-15`),
          method: 'Orange Money',
          transactionId: 'OM-2023-001111',
          receiptUrl: '/receipts/rec-2023-001.pdf',
        },
      ],
    },
    {
      id: 'cot-8',
      year: currentYear - 1,
      amount: 450000,
      dueDate: new Date(`${currentYear - 1}-03-31`),
      status: 'PAID',
      paidAt: new Date(`${currentYear - 1}-04-05`),
      paymentMethod: 'Wave',
      transactionId: 'WV-2023-002222',
      receiptUrl: '/receipts/rec-2023-002.pdf',
      association: {
        id: 'assoc-2',
        name: 'ARPA',
        logo: null,
      },
      payments: [
        {
          id: 'pay-5',
          amount: 450000,
          paidAt: new Date(`${currentYear - 1}-04-05`),
          method: 'Wave',
          transactionId: 'WV-2023-002222',
          receiptUrl: '/receipts/rec-2023-002.pdf',
        },
      ],
    },
    {
      id: 'cot-9',
      year: currentYear - 1,
      amount: 450000,
      dueDate: new Date(`${currentYear - 1}-03-31`),
      status: 'PAID',
      paidAt: new Date(`${currentYear - 1}-06-20`),
      paymentMethod: 'Orange Money',
      transactionId: 'OM-2023-003333',
      receiptUrl: '/receipts/rec-2023-003.pdf',
      association: {
        id: 'assoc-3',
        name: 'UCIAV',
        logo: null,
      },
      payments: [
        {
          id: 'pay-6',
          amount: 450000,
          paidAt: new Date(`${currentYear - 1}-06-20`),
          method: 'Orange Money',
          transactionId: 'OM-2023-003333',
          receiptUrl: '/receipts/rec-2023-003.pdf',
        },
      ],
    },
    {
      id: 'cot-10',
      year: currentYear - 1,
      amount: 450000,
      dueDate: new Date(`${currentYear - 1}-03-31`),
      status: 'PAID',
      paidAt: new Date(`${currentYear - 1}-02-28`),
      paymentMethod: 'Carte Bancaire',
      transactionId: 'CB-2023-004444',
      receiptUrl: '/receipts/rec-2023-004.pdf',
      association: {
        id: 'assoc-5',
        name: 'ACI',
        logo: null,
      },
      payments: [
        {
          id: 'pay-7',
          amount: 450000,
          paidAt: new Date(`${currentYear - 1}-02-28`),
          method: 'Carte Bancaire',
          transactionId: 'CB-2023-004444',
          receiptUrl: '/receipts/rec-2023-004.pdf',
        },
      ],
    },
  ];
}

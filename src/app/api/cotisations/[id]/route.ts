import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cotisation = await db.cotisation.findUnique({
      where: { id },
      include: {
        association: {
          select: {
            id: true,
            name: true,
            logo: true,
            email: true,
            phone: true,
            address: true,
          },
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

    if (cotisation) {
      return NextResponse.json(cotisation);
    }

    // Return sample data if not found in database
    const sampleCotisation = getSampleCotisationById(id);
    if (sampleCotisation) {
      return NextResponse.json(sampleCotisation);
    }

    return NextResponse.json({ error: 'Cotisation not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching cotisation:', error);
    
    const { id } = await params;
    const sampleCotisation = getSampleCotisationById(id);
    if (sampleCotisation) {
      return NextResponse.json(sampleCotisation);
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getSampleCotisationById(id: string) {
  const currentYear = new Date().getFullYear();
  
  const sampleData: Record<string, unknown> = {
    'cot-1': {
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
        email: 'contact@aprocib.ci',
        phone: '+225 27 22 00 00 00',
        address: 'Abidjan, Plateau',
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
    'cot-2': {
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
        email: 'contact@arpa.ci',
        phone: '+225 27 21 00 00 00',
        address: 'Abidjan, Cocody',
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
    'cot-3': {
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
        email: 'contact@uciav.ci',
        phone: '+225 27 20 00 00 00',
        address: 'Abidjan, Treichville',
      },
      payments: [],
    },
    'cot-4': {
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
        email: 'contact@apiac.ci',
        phone: '+225 27 23 00 00 00',
        address: 'Abidjan, Marcory',
      },
      payments: [],
    },
  };

  return sampleData[id] || null;
}
